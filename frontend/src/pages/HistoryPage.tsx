import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getHistory } from '../api';
import type { Prompt, PaginatedResponse } from '../types';

export default function HistoryPage() {
  const [data, setData] = useState<PaginatedResponse<Prompt> | null>(null);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHistory(page).then(setData).finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Learning History</h1>
        {data?.data.length === 0 && (
          <p style={styles.empty}>No lessons yet. Go to <a href="/learn">Learn</a> to start!</p>
        )}
        {data?.data.map((p) => (
          <div key={p.id} style={styles.card}>
            <div style={styles.cardHeader} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
              <div>
                <div style={styles.prompt}>"{p.prompt}"</div>
                <div style={styles.meta}>
                  <span style={styles.tag}>{p.category.name}</span>
                  <span style={styles.tag}>{p.subCategory.name}</span>
                  <span style={styles.date}>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span style={styles.chevron}>{expanded === p.id ? '▲' : '▼'}</span>
            </div>
            {expanded === p.id && (
              <div style={styles.response}>
                <ReactMarkdown>{p.response}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {data && data.totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
            <span style={styles.pageInfo}>Page {page} of {data.totalPages}</span>
            <button style={styles.pageBtn} disabled={page === data.totalPages} onClick={() => setPage(page + 1)}>Next →</button>
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
  center: { textAlign: 'center', padding: 60, color: '#64748b' },
  empty: { color: '#64748b', textAlign: 'center', padding: 40 },
  card: { background: '#fff', borderRadius: 12, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardHeader: { padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  prompt: { fontWeight: 600, color: '#1e293b', marginBottom: 6 },
  meta: { display: 'flex', gap: 8, alignItems: 'center' },
  tag: { background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  date: { color: '#94a3b8', fontSize: 12 },
  chevron: { color: '#94a3b8', fontSize: 12 },
  response: { padding: '0 20px 20px', borderTop: '1px solid #f1f5f9', lineHeight: 1.7, color: '#334155' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 24 },
  pageBtn: { padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' },
  pageInfo: { color: '#64748b', fontSize: 14 },
};
