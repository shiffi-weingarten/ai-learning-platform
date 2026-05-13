import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getCategories, submitPrompt } from '../api';
import type { Category, Prompt } from '../types';

export default function LearnPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [promptText, setPromptText] = useState('');
  const [result, setResult] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setError('Failed to load categories'));
  }, []);

  const selectedCategory = categories.find((c) => c.id === Number(categoryId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !subCategoryId || !promptText.trim()) return;
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await submitPrompt({
        categoryId: Number(categoryId),
        subCategoryId: Number(subCategoryId),
        prompt: promptText,
      });
      setResult(data);
    } catch {
      setError('Failed to generate lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Start Learning</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <select style={styles.select} value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setSubCategoryId(''); }} required>
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Sub-Category</label>
              <select style={styles.select} value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)} required disabled={!categoryId}>
                <option value="">Select sub-category...</option>
                {selectedCategory?.subCategories.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>What do you want to learn?</label>
            <textarea style={styles.textarea} rows={3} placeholder="e.g. Explain closures in JavaScript..."
              value={promptText} onChange={(e) => setPromptText(e.target.value)} required />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Generating lesson...' : '🚀 Generate Lesson'}
          </button>
        </form>

        {result && (
          <div style={styles.result}>
            <div style={styles.resultMeta}>
              <span style={styles.tag}>{result.category.name}</span>
              <span style={styles.tag}>{result.subCategory.name}</span>
            </div>
            <div style={styles.markdown}>
              <ReactMarkdown>{result.response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { background: '#f1f5f9', minHeight: '100vh', padding: '32px 16px' },
  container: { maxWidth: 800, margin: '0 auto' },
  title: { color: '#1e293b', marginBottom: 24 },
  form: { background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'flex', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  label: { fontSize: 13, fontWeight: 600, color: '#475569' },
  select: { padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, background: '#fff' },
  textarea: { padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' },
  btn: { padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 600 },
  error: { color: '#ef4444', fontSize: 13 },
  result: { marginTop: 24, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  resultMeta: { display: 'flex', gap: 8, marginBottom: 16 },
  tag: { background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  markdown: { lineHeight: 1.7, color: '#334155' },
};
