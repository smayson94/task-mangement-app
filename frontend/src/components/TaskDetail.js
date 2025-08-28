import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import './TaskDetail.css';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, deleteTask, updateTask } = useTaskContext();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Load task from API - because apparently we need to get data
  const loadTask = useCallback(async () => {
    try {
      setLoading(true);
      const taskData = await getTaskById(id);
      setTask(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  }, [id, getTaskById, navigate]);

  // Load task data - because apparently we need to see the task
  useEffect(() => {
    loadTask();
  }, [id, loadTask]);

  // Handle task deletion - because apparently we need to remove things
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      try {
        setDeleting(true);
        await deleteTask(id);
        navigate('/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format relative date - because apparently we need to know when things are due
  const formatRelativeDate = (dateString) => {
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
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return `Due on ${formatDate(dateString)}`;
    }
  };

  // Check if task is overdue - because apparently we need to know what's late
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  };

  if (loading) {
    return (
      <div className="task-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-not-found">
        <h2>Task Not Found</h2>
        <p>The task you're looking for doesn't exist.</p>
        <Link to="/tasks" className="back-to-tasks">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="task-detail">
      {/* Header - because apparently we need a header */}
      <div className="task-detail-header">
        <div className="header-content">
          <h1>{task.title}</h1>
          <div className="task-meta-badges">
            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`status-badge ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Link to={`/tasks/${id}/edit`} className="edit-button">
            <span className="edit-icon">✏️</span>
            Edit Task
          </Link>
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            <span className="delete-icon">🗑️</span>
            {deleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>

      {/* Task content - because apparently we need to show the content */}
      <div className="task-content">
        <div className="task-main">
          {/* Description - because apparently we need to see what the task is about */}
          {task.description && (
            <div className="task-section">
              <h3>Description</h3>
              <p className="task-description">{task.description}</p>
            </div>
          )}

          {/* Due date - because apparently we need to know when it's due */}
          <div className="task-section">
            <h3>Due Date</h3>
            <div className={`due-date-info ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
              <span className="due-date-text">{formatRelativeDate(task.dueDate)}</span>
              {task.dueDate && (
                <span className="due-date-full">({formatDate(task.dueDate)})</span>
              )}
            </div>
          </div>

          {/* Tags - because apparently we need to categorize things */}
          {task.tags && task.tags.length > 0 && (
            <div className="task-section">
              <h3>Tags</h3>
              <div className="task-tags">
                {task.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps - because apparently we need to know when things happened */}
          <div className="task-section">
            <h3>Task Information</h3>
            <div className="task-info-grid">
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">
                  {new Date(task.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Task ID:</span>
                <span className="info-value task-id">{task.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task sidebar - because apparently we need additional information */}
        <div className="task-sidebar">
          {/* Quick actions - because apparently we need to do things quickly */}
          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button
                className={`status-toggle ${task.status === 'completed' ? 'completed' : ''}`}
                onClick={async () => {
                  try {
                    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                    await updateTask(task.id, { status: newStatus });
                    // Refresh the task data
                    loadTask();
                  } catch (error) {
                    console.error('Error updating task status:', error);
                  }
                }}
              >
                {task.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
              </button>
              
              {task.status === 'todo' && (
                <button
                  className="status-toggle in-progress"
                  onClick={async () => {
                    try {
                      await updateTask(task.id, { status: 'in_progress' });
                      // Refresh the task data
                      loadTask();
                    } catch (error) {
                      console.error('Error updating task status:', error);
                    }
                  }}
                >
                  Start Progress
                </button>
              )}
            </div>
          </div>

          {/* Task statistics - because apparently we need to see statistics */}
          <div className="sidebar-section">
            <h3>Task Statistics</h3>
            <div className="task-stats">
              <div className="stat-item">
                <span className="stat-label">Priority Level</span>
                <span className={`stat-value priority-${task.priority}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className={`stat-value status-${task.status}`}>
                  {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tags Count</span>
                <span className="stat-value">{task.tags.length}</span>
              </div>
            </div>
          </div>

          {/* Related actions - because apparently we need to navigate */}
          <div className="sidebar-section">
            <h3>Navigation</h3>
            <div className="navigation-links">
              <Link to="/tasks" className="nav-link">
                ← Back to Tasks
              </Link>
              <Link to="/tasks/new" className="nav-link">
                + Create New Task
              </Link>
              <Link to="/statistics" className="nav-link">
                📊 View Statistics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
