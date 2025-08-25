import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import axios from 'axios';
import './MinimalDashboard.css';

const MinimalDashboard = () => {
  const { tasks, loading } = useTaskContext();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await axios.get('/api/stats');
        setStats(statsResponse.data);

        const tasksResponse = await axios.get('/api/tasks?limit=6&sortBy=createdAt&sortOrder=desc');
        setRecentTasks(tasksResponse.data.tasks);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({ total: 0, byStatus: { completed: 0, in_progress: 0, todo: 0 }, overdue: 0 });
        setRecentTasks([]);
      }
    };

    fetchDashboardData();
  }, []);

  // Get priority color and icon
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high':
        return { color: '#ef4444', icon: '🔥', bg: '#fef2f2' };
      case 'medium':
        return { color: '#f59e0b', icon: '⚡', bg: '#fffbeb' };
      case 'low':
        return { color: '#10b981', icon: '🌱', bg: '#f0fdf4' };
      default:
        return { color: '#6b7280', icon: '📌', bg: '#f9fafb' };
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#f59e0b';
      case 'todo':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if task is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.byStatus.completed / stats.total) * 100);
  };

  if (loading) {
    return (
      <div className="minimal-dashboard-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading your workspace...</p>
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
          <h1>Welcome back!</h1>
          <p>Here's what's happening with your tasks today</p>
        </div>
        <div className="header-actions">
          <Link to="/tasks/new" className="create-button">
            <span className="create-icon">+</span>
            New Task
          </Link>
          <Link to="/kanban" className="view-board-button">
            <span className="board-icon">📋</span>
            View Board
          </Link>
        </div>
      </motion.div>

      <div className="dashboard-content">
        {/* Main Content */}
        <div className="main-content">
          {/* Stats Cards */}
          {stats && (
            <motion.div
              className="stats-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Total Tasks</h3>
                  <p className="stat-number">{stats.total}</p>
                </div>
              </div>

              <div className="stat-card completed">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Completed</h3>
                  <p className="stat-number">{stats.byStatus.completed}</p>
                </div>
              </div>

              <div className="stat-card in-progress">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>In Progress</h3>
                  <p className="stat-number">{stats.byStatus.in_progress}</p>
                </div>
              </div>

              <div className="stat-card overdue">
                <div className="stat-icon">🚨</div>
                <div className="stat-content">
                  <h3>Overdue</h3>
                  <p className="stat-number">{stats.overdue}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Tasks */}
          <motion.div
            className="recent-tasks-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="section-header">
              <h2>Recent Tasks</h2>
              <Link to="/tasks" className="view-all-link">View All</Link>
            </div>

            {recentTasks.length > 0 ? (
              <div className="tasks-grid">
                {recentTasks.map((task, index) => {
                  const priorityInfo = getPriorityInfo(task.priority);
                  const statusColor = getStatusColor(task.status);
                  const overdue = isOverdue(task.dueDate);
                  
                  return (
                    <motion.div
                      key={task.id}
                      className="task-card"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.1 * index,
                        type: "spring",
                        stiffness: 300
                      }}
                      whileHover={{ 
                        y: -4, 
                        scale: 1.02,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <div className="task-header">
                        <div className="task-meta">
                          <div 
                            className="priority-indicator"
                            style={{ 
                              backgroundColor: priorityInfo.bg,
                              borderColor: priorityInfo.color
                            }}
                          >
                            <span className="priority-icon">{priorityInfo.icon}</span>
                          </div>
                          <span 
                            className="status-indicator"
                            style={{ backgroundColor: statusColor }}
                          >
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                        <Link to={`/tasks/${task.id}`} className="task-link">
                          <span className="link-icon">→</span>
                        </Link>
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
                          <div className={`due-date ${overdue ? 'overdue' : ''}`}>
                            <span className="due-icon">📅</span>
                            <span className="due-text">{formatDate(task.dueDate)}</span>
                            {overdue && (
                              <motion.span
                                className="overdue-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                Overdue
                              </motion.span>
                            )}
                          </div>
                        )}

                        {task.tags && task.tags.length > 0 && (
                          <div className="task-tags">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <motion.span
                                key={index}
                                className="tag"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {tag}
                              </motion.span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="tag-more">+{task.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="no-tasks">
                <div className="no-tasks-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started</p>
                <Link to="/tasks/new" className="create-first-task">
                  Create Your First Task
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Statistics Sidebar */}
        {stats && (
          <motion.div
            className="stats-sidebar"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="sidebar-section">
              <h3>Progress Overview</h3>
              <div className="progress-ring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - getCompletionPercentage() / 100)}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - getCompletionPercentage() / 100) }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-percentage">{getCompletionPercentage()}%</span>
                  <span className="progress-label">Complete</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Status Breakdown</h3>
              <div className="status-breakdown">
                <div className="status-item">
                  <div className="status-dot" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="status-label">To Do</span>
                  <span className="status-count">{stats.byStatus.todo}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="status-label">In Progress</span>
                  <span className="status-count">{stats.byStatus.in_progress}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{ backgroundColor: '#10b981' }}></div>
                  <span className="status-label">Completed</span>
                  <span className="status-count">{stats.byStatus.completed}</span>
                </div>
              </div>
            </div>

            {stats.overdue > 0 && (
              <div className="sidebar-section overdue-section">
                <h3>⚠️ Overdue Items</h3>
                <div className="overdue-alert">
                  <span className="overdue-count">{stats.overdue}</span>
                  <span className="overdue-text">tasks need attention</span>
                </div>
                <Link to="/tasks?status=todo" className="view-overdue">
                  View Overdue Tasks
                </Link>
              </div>
            )}

            <div className="sidebar-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <Link to="/tasks/new" className="quick-action">
                  <span className="action-icon">+</span>
                  Add Task
                </Link>
                <Link to="/kanban" className="quick-action">
                  <span className="action-icon">📋</span>
                  Kanban Board
                </Link>
                <Link to="/statistics" className="quick-action">
                  <span className="action-icon">📈</span>
                  Analytics
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MinimalDashboard;
