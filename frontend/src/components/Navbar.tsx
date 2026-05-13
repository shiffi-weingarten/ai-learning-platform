import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🎓 AI Learning</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/learn" style={styles.link}>Learn</Link>
            <Link to="/history" style={styles.link}>History</Link>
            {user.role === 'ADMIN' && <Link to="/admin" style={styles.link}>Admin</Link>}
            <span style={styles.name}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#1e293b', color: '#fff' },
  brand: { color: '#60a5fa', fontWeight: 700, fontSize: 20, textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: 16 },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: 14 },
  name: { color: '#94a3b8', fontSize: 14 },
  btn: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 14 },
};
