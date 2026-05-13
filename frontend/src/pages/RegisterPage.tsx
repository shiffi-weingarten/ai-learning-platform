import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../components/AuthContext';

export default function RegisterPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      setAuth(data.user, data.token);
      navigate('/learn');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
      setError(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} placeholder="Full Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} placeholder="Phone Number" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Password (min 6 chars)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={styles.footer}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
  card: { background: '#fff', padding: 48, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: 440 },
  title: { margin: '0 0 20px', textAlign: 'center', color: '#1e293b' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' },
  btn: { padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 600 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 8 },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' },
};
