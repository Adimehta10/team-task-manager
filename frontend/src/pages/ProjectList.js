import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects', form);
      setProjects([...projects, res.data]);
      setShowModal(false);
      setForm({ name: '', description: '' });
      toast.success('Project created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>My Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
      </div>

      {projects.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid-3">
          {projects.map(p => (
            <div key={p._id} className="card" onClick={() => navigate(`/projects/${p._id}`)}>
              <h3>{p.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{p.description || 'No description'}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>👥 {p.members.length} members</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Project</h2>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Project Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website Redesign" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" rows={3} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}