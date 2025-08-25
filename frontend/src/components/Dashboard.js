import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { tasks, loading } = useTaskContext();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);

  // Fetch dashboard data - because apparently we need to show something
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        // Fetch statistics - because apparently we need to know how we're doing
        const statsResponse = await axios.get('/api/stats');
        console.log('Stats response:', statsResponse.data);
        setStats(statsResponse.data);

        // Fetch recent tasks - because apparently we need to see what's new
        const tasksResponse = await axios.get('/api/tasks?limit=5&sortBy=createdAt&sortOrder=desc');
        console.log('Tasks response:', tasksResponse.data);
        setRecentTasks(tasksResponse.data.tasks);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values if API fails
        setStats({ total: 0, byStatus: { completed: 0, in_progress: 0, todo: 0 }, overdue: 0 });
        setRecentTasks([]);
      }
    };

    fetchDashboardData();
  }, []);

  // Get priority color - because apparently we need visual indicators
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  // Get status color - because apparently we need visual indicators
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      case 'todo':
        return 'status-todo';
      default:
        return '';
    }
  };

  // Format date - because apparently dates are hard to read
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  console.log('Dashboard rendering, stats:', stats, 'recentTasks:', recentTasks);
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to TaskMaster</h1>
        <p>Manage your tasks efficiently and stay organized</p>
      </div>

      {/* Quick Stats - because apparently we need to see numbers */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Tasks</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p className="stat-number">{stats.byStatus.completed}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>In Progress</h3>
              <p className="stat-number">{stats.byStatus.in_progress}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <h3>Overdue</h3>
              <p className="stat-number">{stats.overdue}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - because apparently we need to do things quickly */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/tasks/new" className="action-button primary" onClick={() => console.log('Create New Task clicked')}>
            <span className="action-icon">➕</span>
            Create New Task
          </Link>
          <Link to="/tasks" className="action-button secondary" onClick={() => console.log('View All Tasks clicked')}>
            <span className="action-icon">📝</span>
            View All Tasks
          </Link>
          <Link to="/statistics" className="action-button secondary" onClick={() => console.log('View Statistics clicked')}>
            <span className="action-icon">📈</span>
            View Statistics
          </Link>
        </div>
      </div>

      {/* Recent Tasks - because apparently we need to see what's new */}
      <div className="recent-tasks">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="view-all-link">View All</Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="tasks-grid">
            {recentTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-badges">
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                <div className="task-meta">
                  <span className="due-date">{formatDate(task.dueDate)}</span>
                  {task.tags.length > 0 && (
                    <div className="task-tags">
                      {task.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className="tag-more">+{task.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="task-actions">
                  <Link to={`/tasks/${task.id}`} className="action-link">
                    View Details
                  </Link>
                  <Link to={`/tasks/${task.id}/edit`} className="action-link">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks">
            <p>No tasks yet. Create your first task to get started!</p>
            <Link to="/tasks/new" className="create-first-task">
              Create Your First Task
            </Link>
          </div>
        )}
      </div>

      {/* Progress Overview - because apparently we need to see progress */}
      {stats && (
        <div className="progress-overview">
          <h2>Progress Overview</h2>
          <div className="progress-stats">
            <div className="progress-item">
              <div className="progress-label">Completion Rate</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <div className="progress-value">{stats.completionRate}%</div>
            </div>

            <div className="progress-item">
              <div className="progress-label">High Priority Tasks</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill high-priority" 
                  style={{ width: `${stats.total > 0 ? (stats.byPriority.high / stats.total * 100) : 0}%` }}
                ></div>
              </div>
              <div className="progress-value">{stats.byPriority.high}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
