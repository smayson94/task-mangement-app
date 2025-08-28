import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import './TaskList.css';

const TaskList = () => {
  const {
    tasks,
    loading,
    pagination,
    filters,
    updateFilters,
    updatePagination,
    updateSort,
    deleteTask
  } = useTaskContext();

  const [localFilters, setLocalFilters] = useState({
    status: '',
    priority: '',
    search: '',
    tags: []
  });

  // Track if this is the initial render to prevent unnecessary filter updates
  const [isInitialRender, setIsInitialRender] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());

  // Initialize local filters from context - because apparently we need to sync state
  useEffect(() => {
    // Only sync if filters have actual values to avoid triggering unnecessary updates
    const hasActiveContextFilters = Object.keys(filters).some(key => {
      if (key === 'tags') {
        return Array.isArray(filters[key]) && filters[key].length > 0;
      }
      return filters[key] !== '' && filters[key] !== null && filters[key] !== undefined;
    });

    if (hasActiveContextFilters) {
      console.log('TaskList: Syncing filters from context:', filters);
      setLocalFilters(filters);
    } else {
      console.log('TaskList: No active context filters, keeping default state');
    }
  }, []); // Only run on mount to avoid infinite loop

  // Apply filters with debounce - because apparently we need to avoid too many API calls
  useEffect(() => {
    // Skip the first render to prevent initial filter update
    if (isInitialRender) {
      console.log('TaskList: Initial render, skipping filter update');
      setIsInitialRender(false);
      return;
    }

    // Only update filters if there are actual filter values to avoid infinite loops
    const hasActiveFilters = Object.keys(localFilters).some(key => {
      if (key === 'tags') {
        return Array.isArray(localFilters[key]) && localFilters[key].length > 0;
      }
      return localFilters[key] !== '' && localFilters[key] !== null && localFilters[key] !== undefined;
    });

    // Check if filters are different from context filters to avoid unnecessary updates
    const filtersChanged = Object.keys(localFilters).some(key => {
      if (key === 'tags') {
        const localTags = localFilters[key] || [];
        const contextTags = filters[key] || [];
        return localTags.length !== contextTags.length || 
               localTags.some(tag => !contextTags.includes(tag));
      }
      return localFilters[key] !== filters[key];
    });

    if (hasActiveFilters && filtersChanged) {
      console.log('TaskList: Filters changed, scheduling update:', localFilters);
      const timeoutId = setTimeout(() => {
        console.log('TaskList: Updating filters:', localFilters);
        updateFilters(localFilters);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (!hasActiveFilters) {
      console.log('TaskList: No active filters, skipping update');
    } else {
      console.log('TaskList: Filters unchanged, skipping update');
    }
  }, [localFilters, updateFilters, isInitialRender]); // Removed 'filters' dependency to prevent infinite loop

  // Handle filter changes - because apparently we need to update filters
  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle search input - because apparently we need to search things
  const handleSearchChange = (e) => {
    handleFilterChange('search', e.target.value);
  };

  // Handle status filter - because apparently we need to filter by status
  const handleStatusFilter = (status) => {
    handleFilterChange('status', status === filters.status ? '' : status);
  };

  // Handle priority filter - because apparently we need to filter by priority
  const handlePriorityFilter = (priority) => {
    handleFilterChange('priority', priority === filters.priority ? '' : priority);
  };

  // Handle tag filter - because apparently we need to filter by tags
  const handleTagFilter = (tag) => {
    const newTags = localFilters.tags.includes(tag)
      ? localFilters.tags.filter(t => t !== tag)
      : [...localFilters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  // Clear all filters - because apparently we need to reset things
  const clearFilters = () => {
    console.log('TaskList: Clearing all filters');
    setLocalFilters({
      status: '',
      priority: '',
      search: '',
      tags: []
    });
    // Also clear context filters to ensure consistency
    updateFilters({
      status: '',
      priority: '',
      search: '',
      tags: []
    });
  };

  // Handle pagination - because apparently we need to navigate pages
  const handlePageChange = (page) => {
    updatePagination({ page });
  };

  // Handle sorting - because apparently we need to sort things
  const handleSort = (sortBy) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateSort(sortBy, newSortOrder);
  };

  // Handle task selection - because apparently we need to select things
  const handleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  // Handle bulk delete - because apparently we need to delete multiple things
  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedTasks.size} selected task(s)?`
    );

    if (confirmed) {
      try {
        const deletePromises = Array.from(selectedTasks).map(taskId => deleteTask(taskId));
        await Promise.all(deletePromises);
        setSelectedTasks(new Set());
      } catch (error) {
        console.error('Error deleting tasks:', error);
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

  // Get available tags from tasks - because apparently we need to know what tags exist
  const getAvailableTags = () => {
    const tagSet = new Set();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h1>Task List</h1>
        <div className="header-actions">
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="filter-icon">🔍</span>
            Filters
          </button>
          <Link to="/tasks/new" className="create-task-button">
            <span className="create-icon">➕</span>
            Create Task
          </Link>
        </div>
      </div>

      {/* Filters Section - because apparently we need to filter things */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-row">
            {/* Search Filter - because apparently we need to search things */}
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search tasks..."
                value={localFilters.search}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            {/* Status Filter - because apparently we need to filter by status */}
            <div className="filter-group">
              <label>Status</label>
              <div className="filter-buttons">
                {['todo', 'in_progress', 'completed'].map(status => (
                  <button
                    key={status}
                    className={`filter-button ${localFilters.status === status ? 'active' : ''}`}
                    onClick={() => handleStatusFilter(status)}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter - because apparently we need to filter by priority */}
            <div className="filter-group">
              <label>Priority</label>
              <div className="filter-buttons">
                {['low', 'medium', 'high'].map(priority => (
                  <button
                    key={priority}
                    className={`filter-button ${localFilters.priority === priority ? 'active' : ''}`}
                    onClick={() => handlePriorityFilter(priority)}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Filter - because apparently we need to filter by tags */}
          <div className="filter-group">
            <label>Tags</label>
            <div className="tag-filters">
              {getAvailableTags().map(tag => (
                <button
                  key={tag}
                  className={`tag-filter ${localFilters.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters - because apparently we need to reset things */}
          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Bulk Actions - because apparently we need to do things in bulk */}
      {selectedTasks.size > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">
            {selectedTasks.size} task(s) selected
          </span>
          <button className="bulk-delete" onClick={handleBulkDelete}>
            Delete Selected
          </button>
        </div>
      )}

      {/* Task Table - because apparently we need to see tasks in a table */}
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th className="select-column">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === tasks.length && tasks.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks(new Set(tasks.map(task => task.id)));
                    } else {
                      setSelectedTasks(new Set());
                    }
                  }}
                />
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('title')}
              >
                Title
                {filters.sortBy === 'title' && (
                  <span className="sort-indicator">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('priority')}
              >
                Priority
                {filters.sortBy === 'priority' && (
                  <span className="sort-indicator">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('status')}
              >
                Status
                {filters.sortBy === 'status' && (
                  <span className="sort-indicator">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('dueDate')}
              >
                Due Date
                {filters.sortBy === 'dueDate' && (
                  <span className="sort-indicator">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id} className="task-row">
                  <td className="select-column">
                    <input
                      type="checkbox"
                      checked={selectedTasks.has(task.id)}
                      onChange={() => handleTaskSelection(task.id)}
                    />
                  </td>
                  <td className="task-title">
                    <Link to={`/tasks/${task.id}`} className="task-link">
                      {task.title}
                    </Link>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="due-date">
                    {formatDate(task.dueDate)}
                  </td>
                  <td className="task-tags">
                    {task.tags.length > 0 ? (
                      <div className="tags-container">
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="tag-more">+{task.tags.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="no-tags">No tags</span>
                    )}
                  </td>
                  <td className="task-actions">
                    <Link to={`/tasks/${task.id}`} className="action-button view">
                      View
                    </Link>
                    <Link to={`/tasks/${task.id}/edit`} className="action-button edit">
                      Edit
                    </Link>
                    <button
                      className="action-button delete"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          deleteTask(task.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-tasks">
                  <div className="no-tasks-content">
                    <p>No tasks found matching your filters.</p>
                    <button className="clear-filters" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - because apparently we need to navigate pages */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={!pagination.hasPrev}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${page === pagination.page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-button"
            disabled={!pagination.hasNext}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Task Count - because apparently we need to know how many things we have */}
      <div className="task-count">
        Showing {tasks.length} of {pagination.total} tasks
      </div>
    </div>
  );
};

export default TaskList;
