import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [tagStats, setTagStats] = useState(null);
  const [completionTrend, setCompletionTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Load statistics data - because apparently we need to see statistics
  useEffect(() => {
    loadStatistics();
  }, []);

  // Load all statistics - because apparently we need to get data
  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Load main stats - because apparently we need the main statistics
      const statsResponse = await axios.get('/api/stats');
      setStats(statsResponse.data);
      
      // Load overdue tasks - because apparently we need to see what's late
      const overdueResponse = await axios.get('/api/stats/overdue');
      setOverdueTasks(overdueResponse.data.tasks);
      
      // Load tag statistics - because apparently we need to see tag usage
      const tagResponse = await axios.get('/api/stats/tags');
      setTagStats(tagResponse.data);
      
      // Load completion trend - because apparently we need to see trends
      const trendResponse = await axios.get('/api/stats/completion-trend');
      setCompletionTrend(trendResponse.data);
      
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
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
      <div className="statistics-loading">
        <div className="loading-spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h1>Task Statistics & Analytics</h1>
        <p>Comprehensive overview of your task management performance</p>
      </div>

      {/* Tab Navigation - because apparently we need to organize information */}
      <div className="statistics-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          🚨 Overdue Tasks
        </button>
        <button
          className={`tab-button ${activeTab === 'tags' ? 'active' : ''}`}
          onClick={() => setActiveTab('tags')}
        >
          🏷️ Tag Analysis
        </button>
        <button
          className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📈 Trends
        </button>
      </div>

      {/* Overview Tab - because apparently we need to see the overview */}
      {activeTab === 'overview' && stats && (
        <div className="tab-content">
          {/* Key Metrics - because apparently we need to see key numbers */}
          <div className="metrics-grid">
            <div className="metric-card total-tasks">
              <div className="metric-icon">📝</div>
              <div className="metric-content">
                <h3>Total Tasks</h3>
                <p className="metric-value">{stats.total}</p>
                <p className="metric-description">All tasks in the system</p>
              </div>
            </div>

            <div className="metric-card completion-rate">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <h3>Completion Rate</h3>
                <p className="metric-value">{stats.completionRate}%</p>
                <p className="metric-description">Tasks completed successfully</p>
              </div>
            </div>

            <div className="metric-card overdue-tasks">
              <div className="metric-icon">🚨</div>
              <div className="metric-content">
                <h3>Overdue Tasks</h3>
                <p className="metric-value">{stats.overdue}</p>
                <p className="metric-description">Tasks past due date</p>
              </div>
            </div>

            <div className="metric-card high-priority">
              <div className="metric-icon">🔥</div>
              <div className="metric-content">
                <h3>High Priority</h3>
                <p className="metric-value">{stats.byPriority.high}</p>
                <p className="metric-description">High priority tasks</p>
              </div>
            </div>
          </div>

          {/* Status Distribution - because apparently we need to see status breakdown */}
          <div className="stats-section">
            <h2>Status Distribution</h2>
            <div className="status-chart">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="status-bar">
                  <div className="status-label">
                    <span className={`status-indicator ${getStatusColor(status)}`}></span>
                    {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="status-bar-container">
                    <div 
                      className={`status-bar-fill ${getStatusColor(status)}`}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="status-count">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution - because apparently we need to see priority breakdown */}
          <div className="stats-section">
            <h2>Priority Distribution</h2>
            <div className="priority-chart">
              {Object.entries(stats.byPriority).map(([priority, count]) => (
                <div key={priority} className="priority-item">
                  <div className="priority-label">
                    <span className={`priority-indicator ${getPriorityColor(priority)}`}></span>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </div>
                  <div className="priority-bar-container">
                    <div 
                      className={`priority-bar-fill ${getPriorityColor(priority)}`}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="priority-count">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overdue Tasks Tab - because apparently we need to see what's late */}
      {activeTab === 'overdue' && (
        <div className="tab-content">
          <div className="overdue-header">
            <h2>Overdue Tasks</h2>
            <p className="overdue-count">{overdueTasks.length} tasks are overdue</p>
          </div>

          {overdueTasks.length > 0 ? (
            <div className="overdue-tasks">
              {overdueTasks.map((task) => (
                <div key={task.id} className="overdue-task-card">
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
                    <span className="overdue-info">
                      <span className="overdue-icon">🚨</span>
                      {formatDate(task.dueDate)}
                    </span>
                    {task.tags.length > 0 && (
                      <div className="task-tags">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-overdue">
              <div className="no-overdue-icon">🎉</div>
              <h3>No Overdue Tasks!</h3>
              <p>Great job! All your tasks are up to date.</p>
            </div>
          )}
        </div>
      )}

      {/* Tag Analysis Tab - because apparently we need to see tag usage */}
      {activeTab === 'tags' && tagStats && (
        <div className="tab-content">
          <div className="tags-overview">
            <h2>Tag Usage Analysis</h2>
            <p className="tags-summary">
              {tagStats.totalTags} unique tags used across {tagStats.tagStats.reduce((sum, tag) => sum + tag.count, 0)} tasks
            </p>
          </div>

          <div className="tags-chart">
            {tagStats.tagStats.map((tag, index) => (
              <div key={tag.tag} className="tag-item">
                <div className="tag-label">
                  <span className="tag-name">{tag.tag}</span>
                  <span className="tag-count">{tag.count} tasks</span>
                </div>
                <div className="tag-bar-container">
                  <div 
                    className="tag-bar-fill"
                    style={{ 
                      width: `${(tag.count / Math.max(...tagStats.tagStats.map(t => t.count))) * 100}%`,
                      backgroundColor: `hsl(${200 + (index * 30) % 360}, 70%, 60%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends Tab - because apparently we need to see trends */}
      {activeTab === 'trends' && completionTrend && (
        <div className="tab-content">
          <div className="trends-overview">
            <h2>Completion Trends</h2>
            <p className="trends-summary">
              Task completion trends over {completionTrend.totalDays} days
            </p>
          </div>

          <div className="trends-chart">
            {completionTrend.trendData.map((day, index) => (
              <div key={day.date} className="trend-day">
                <div className="trend-date">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <div className="trend-bars">
                  <div className="trend-bar total">
                    <div className="trend-bar-fill" style={{ height: `${(day.total / Math.max(...completionTrend.trendData.map(d => d.total))) * 100}%` }}></div>
                    <span className="trend-label">Total: {day.total}</span>
                  </div>
                  <div className="trend-bar completed">
                    <div className="trend-bar-fill" style={{ height: `${(day.completed / Math.max(...completionTrend.trendData.map(d => d.total))) * 100}%` }}></div>
                    <span className="trend-label">Completed: {day.completed}</span>
                  </div>
                </div>
                <div className="trend-rate">{day.completionRate}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
