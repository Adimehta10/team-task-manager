import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/dashboard/${id}`)
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <Link to={`/projects/${id}`} className="back-link">← Back to Project</Link>
      <div className="page-header"><h1>📊 Dashboard</h1></div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-num">{data?.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#f0a500' }}>{data?.byStatus['To Do']}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#6c8fff' }}>{data?.byStatus['In Progress']}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#6cffb3' }}>{data?.byStatus['Done']}</div>
          <div className="stat-label">Done</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Tasks per user */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Tasks Per User</h3>
          {data?.perUser?.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No assigned tasks</p>}
          {data?.perUser?.map((u, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>👤 {u.name}</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{u.count} tasks</span>
            </div>
          ))}
        </div>

        {/* Overdue tasks */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>⚠️ Overdue Tasks ({data?.overdueCount})</h3>
          {data?.overdueTasks?.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No overdue tasks 🎉</p>}
          {data?.overdueTasks?.map(t => (
            <div key={t._id} className="overdue" style={{ padding: '0.6rem', marginBottom: '0.5rem', background: 'var(--surface2)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Due: {new Date(t.dueDate).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}