import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import './MinimalDashboard.css';

const MinimalDashboard = () => {
  const { tasks, loading } = useTaskContext();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Calculate statistics
      const total = tasks.length;
      const completed = tasks.filter(task => task.status === 'completed').length;
      const inProgress = tasks.filter(task => task.status === 'in_progress').length;
      const overdue = tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < new Date();
      }).length;

      setStats({ total, completed, inProgress, overdue });

      // Get recent tasks (last 5 created)
      const sorted = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentTasks(sorted.slice(0, 5));
    }
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'todo': return '#3b82f6';
      default: return '#6b7280';
    }
  };



  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getCompletionDelay = (dueDate, completedAt) => {
    if (!dueDate || !completedAt) return null;
    const due = new Date(dueDate);
    const completed = new Date(completedAt);
    const diffTime = completed - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatCompletionInfo = (task) => {
    if (task.status === 'completed' && task.dueDate) {
      const delay = getCompletionDelay(task.dueDate, task.updatedAt);
      if (delay > 0) {
        return `Completed ${delay} day${delay > 1 ? 's' : ''} after due date`;
      } else if (delay === 0) {
        return 'Completed on due date';
      } else {
        return `Completed ${Math.abs(delay)} day${Math.abs(delay) > 1 ? 's' : ''} early`;
      }
    } else if (task.dueDate && isOverdue(task.dueDate)) {
      return `Overdue by ${Math.ceil((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))} day${Math.ceil((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}`;
    }
    return null;
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  if (loading) {
    return (
      <div className="minimal-dashboard-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="minimal-dashboard">
      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1>Task Dashboard</h1>
          <p>Manage your tasks efficiently</p>
        </div>
        <div className="header-actions">
          <motion.button
            className="action-button primary"
            onClick={() => navigate('/tasks/new')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ New Task
          </motion.button>
          <motion.button
            className="action-button secondary"
            onClick={() => navigate('/tasks')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 View All
          </motion.button>
        </div>
      </motion.div>

      <div className="dashboard-content">
        {/* Statistics Grid */}
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="stat-card"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Tasks</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{stats.overdue}</h3>
              <p>Overdue</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="dashboard-main">
          {/* Recent Tasks */}
          <motion.div
            className="recent-tasks-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="section-header">
              <h2>Recent Tasks</h2>
              <button 
                className="view-all-link"
                onClick={() => navigate('/tasks')}
              >
                View All →
              </button>
            </div>
            
            <div className="tasks-grid">
              {recentTasks.length > 0 ? (
                recentTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    className="task-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <div className="task-header">
                      <div className="task-status">
                        <span 
                          className="status-dot"
                          style={{ backgroundColor: getStatusColor(task.status) }}
                        />
                        <span className="status-text">{task.status.replace('_', ' ')}</span>
                      </div>
                      <div 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority}
                      </div>
                    </div>
                    
                    <h3 className="task-title">{task.title}</h3>
                    
                    {task.description && (
                      <p className="task-description">
                        {task.description.length > 80 
                          ? `${task.description.substring(0, 80)}...` 
                          : task.description
                        }
                      </p>
                    )}
                    
                    <div className="task-footer">
                      {task.dueDate && (
                        <div className="due-date">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                          {formatCompletionInfo(task) && (
                            <motion.span
                              className={`completion-info ${task.status === 'completed' ? 'completed' : 'overdue'}`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              {formatCompletionInfo(task)}
                            </motion.span>
                          )}
                        </div>
                      )}
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="task-tags">
                          {task.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="tag">{tag}</span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="tag-more">+{task.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started</p>
                  <button 
                    className="create-task-btn"
                    onClick={() => navigate('/tasks/new')}
                  >
                    Create Task
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Statistics Sidebar */}
          <motion.div
            className="stats-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2>Quick Stats</h2>
            
            {/* Progress Ring */}
            <div className="progress-section">
              <div className="progress-ring">
                <svg width="120" height="120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${(stats.completed / stats.total) * 314} 314`}
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-percentage">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                  <span className="progress-label">Complete</span>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="status-breakdown">
              <h3>Status Breakdown</h3>
              <div className="status-item">
                <span className="status-icon">📋</span>
                <span className="status-label">To Do</span>
                <span className="status-count">{stats.total - stats.completed - stats.inProgress}</span>
              </div>
              <div className="status-item">
                <span className="status-icon">🚀</span>
                <span className="status-label">In Progress</span>
                <span className="status-count">{stats.inProgress}</span>
              </div>
              <div className="status-item">
                <span className="status-icon">✅</span>
                <span className="status-label">Completed</span>
                <span className="status-count">{stats.completed}</span>
              </div>
            </div>

            {/* Overdue Alerts */}
            {stats.overdue > 0 && (
              <div className="overdue-alerts">
                <h3>⚠️ Overdue Tasks</h3>
                <div className="overdue-count">
                  <span className="overdue-number">{stats.overdue}</span>
                  <span className="overdue-text">tasks need attention</span>
                </div>
                <button 
                  className="view-overdue-btn"
                  onClick={() => navigate('/tasks?status=overdue')}
                >
                  View Overdue
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MinimalDashboard;
