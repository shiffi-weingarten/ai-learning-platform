import { useState, useEffect, useCallback } from 'react';
import { adminGetUsers, adminGetUserPrompts } from '../api';
import type { User, Prompt, PaginatedResponse } from '../types';

type UserWithCount = User & { _count: { prompts: number } };

export default function AdminPage() {
  const [users, setUsers] = useState<PaginatedResponse<UserWithCount> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [userPrompts, setUserPrompts] = useState<{ [userId: number]: Prompt[] }>({});
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminGetUsers(page, 20, search).then(setUsers).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const toggleUser = async (userId: number) => {
    if (expandedUser === userId) { setExpandedUser(null); return; }
    setExpandedUser(userId);
    if (!userPrompts[userId]) {
      const data = await adminGetUserPrompts(userId);
      setUserPrompts((prev) => ({ ...prev, [userId]: data.data }));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input style={styles.searchInput} placeholder="Search by name or phone..."
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <button style={styles.searchBtn} type="submit">Search</button>
          {search && <button style={styles.clearBtn} type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</button>}
        </form>

        {loading ? <p style={styles.center}>Loading...</p> : (
          <>
            <p style={styles.total}>Total users: {users?.total ?? 0}</p>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Prompts</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>History</th>
                </tr>
              </thead>
              <tbody>
                {users?.data.map((u) => (
                  <>
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>{u.id}</td>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.phone}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: u.role === 'ADMIN' ? '#fef3c7' : '#dbeafe', color: u.role === 'ADMIN' ? '#92400e' : '#1d4ed8' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{u._count.prompts}</td>
                      <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <button style={styles.viewBtn} onClick={() => toggleUser(u.id)}>
                          {expandedUser === u.id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                    {expandedUser === u.id && (
                      <tr key={`${u.id}-prompts`}>
                        <td colSpan={7} style={styles.promptsCell}>
                          {userPrompts[u.id]?.length === 0 && <p style={{ color: '#94a3b8' }}>No prompts yet.</p>}
                          {userPrompts[u.id]?.map((p) => (
                            <div key={p.id} style={styles.promptRow}>
                              <span style={styles.promptTag}>{p.category.name} › {p.subCategory.name}</span>
                              <span style={styles.promptText}>"{p.prompt}"</span>
                              <span style={styles.promptDate}>{new Date(p.createdAt).toLocaleString()}</span>
                            </div>
                          ))}
                          {!userPrompts[u.id] && <p style={{ color: '#94a3b8' }}>Loading...</p>}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>

            {users && users.totalPages > 1 && (
              <div style={styles.pagination}>
                <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
                <span style={styles.pageInfo}>Page {page} of {users.totalPages}</span>
                <button style={styles.pageBtn} disabled={page === users.totalPages} onClick={() => setPage(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { background: '#f1f5f9', minHeight: '100vh', padding: '32px 16px' },
  container: { maxWidth: 1100, margin: '0 auto' },
  title: { color: '#1e293b', marginBottom: 20 },
  searchRow: { display: 'flex', gap: 8, marginBottom: 16 },
  searchInput: { flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 },
  searchBtn: { padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' },
  clearBtn: { padding: '10px 16px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: 8, cursor: 'pointer' },
  total: { color: '#64748b', fontSize: 13, marginBottom: 12 },
  center: { textAlign: 'center', padding: 40, color: '#64748b' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: 14, color: '#334155' },
  badge: { padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
  viewBtn: { padding: '4px 12px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  promptsCell: { padding: '12px 24px', background: '#f8fafc' },
  promptRow: { display: 'flex', gap: 12, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  promptTag: { background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' },
  promptText: { color: '#334155', fontSize: 13, flex: 1 },
  promptDate: { color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 24 },
  pageBtn: { padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' },
  pageInfo: { color: '#64748b', fontSize: 14 },
};
