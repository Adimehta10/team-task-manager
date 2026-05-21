import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
/* eslint-disable */
export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
 
  const [memberEmail, setMemberEmail] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });

  const isAdmin = project?.members?.find(m => m.user._id === user._id)?.role === 'Admin';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', { ...taskForm, projectId: id });
      setTasks([res.data, ...tasks]);
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
      toast.success('Task updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task deleted!');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/projects/${id}/members`, { email: memberEmail });
      setProject(res.data);
      setMemberEmail('');
      setShowMemberModal(false);
      toast.success('Member added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      const res = await api.delete(`/projects/${id}/members/${userId}`);
      setProject(res.data);
      toast.success('Member removed!');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const getBadgeClass = (status) => {
    if (status === 'To Do') return 'badge badge-todo';
    if (status === 'In Progress') return 'badge badge-inprog';
    return 'badge badge-done';
  };

  const getPriorityClass = (p) => {
    if (p === 'High') return 'badge badge-high';
    if (p === 'Medium') return 'badge badge-med';
    return 'badge badge-low';
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Link to="/projects" className="back-link">← Back to Projects</Link>
      <div className="page-header">
        <div>
          <h1>{project?.name}</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: '0.3rem' }}>{project?.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => navigate(`/projects/${id}/dashboard`)}>📊 Dashboard</button>
          {isAdmin && <button className="btn btn-ghost" onClick={() => setShowMemberModal(true)}>👥 Members</button>}
          {isAdmin && <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>+ Add Task</button>}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban">
        {columns.map(col => (
          <div key={col} className="kanban-col">
            <div className="kanban-col-header">
              <span>{col}</span>
              <span className={getBadgeClass(col)}>{tasks.filter(t => t.status === col).length}</span>
            </div>
            {tasks.filter(t => t.status === col).map(task => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                {task.description && <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{task.description}</p>}
                <div className="task-card-meta">
                  <span className={getPriorityClass(task.priority)}>{task.priority}</span>
                  {task.assignedTo && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>👤 {task.assignedTo.name}</span>}
                  {task.dueDate && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
                {/* Status update buttons */}
                <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {columns.filter(c => c !== col).map(c => (
                    <button key={c} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      onClick={() => handleUpdateTask(task._id, { status: c })}>
                      → {c}
                    </button>
                  ))}
                  {isAdmin && (
                    <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === col).length === 0 && (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No tasks</p>
            )}
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Task</h2>
              <button className="btn btn-ghost" onClick={() => setShowTaskModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} rows={3} placeholder="Optional description" />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>
                  {project?.members?.map(m => (
                    <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Members</h2>
              <button className="btn btn-ghost" onClick={() => setShowMemberModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>Add Member by Email</label>
                <input type="email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="member@email.com" required />
              </div>
              <button type="submit" className="btn btn-primary">Add Member</button>
            </form>
            <div className="members-list">
              {project?.members?.map(m => (
                <div key={m.user._id} className="member-item">
                  <div>
                    <div className="member-name">{m.user.name}</div>
                    <div className="member-email">{m.user.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge badge-${m.role.toLowerCase()}`}>{m.role}</span>
                    {m.user._id !== user._id && (
                      <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => handleRemoveMember(m.user._id)}>Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}