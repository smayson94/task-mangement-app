import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTaskContext } from '../context/TaskContext';
import './TaskForm.css';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createTask, updateTask, getTaskById } = useTaskContext();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form setup with react-hook-form - because apparently we need validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      tags: []
    }
  });

  // Watch tags for dynamic input - because apparently we need to see what we're typing
  const watchedTags = watch('tags');

  // Load task data if editing - because apparently we need to populate the form
  useEffect(() => {
    if (id && id !== 'new') {
      setIsEditing(true);
      loadTaskData();
    }
  }, [id, loadTaskData]);

  // Load task data from API - because apparently we need to get existing data
  const loadTaskData = useCallback(async () => {
    try {
      setLoading(true);
      const task = await getTaskById(id);
      
      // Set form values - because apparently we need to populate the form
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status);
      setValue('priority', task.priority);
      setValue('dueDate', task.dueDate ? task.dueDate.split('T')[0] : '');
      setValue('tags', task.tags || []);
    } catch (error) {
      console.error('Error loading task:', error);
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  }, [id, getTaskById, setValue, navigate]);

  // Handle form submission - because apparently we need to save data
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Prepare task data - because apparently we need to format it properly
      const taskData = {
        ...data,
        tags: data.tags.filter(tag => tag.trim() !== '') // Remove empty tags
      };

      if (isEditing) {
        // Update existing task - because apparently we need to change things
        await updateTask(id, taskData);
      } else {
        // Create new task - because apparently we need to add things
        await createTask(taskData);
      }

      // Navigate back to task list - because apparently we need to go somewhere
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tag input - because apparently we need to manage tags
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      
      // Check if tag already exists - because apparently we don't want duplicates
      if (!watchedTags.includes(newTag)) {
        setValue('tags', [...watchedTags, newTag]);
      }
      
      e.target.value = '';
    }
  };

  // Remove tag - because apparently we need to remove things
  const removeTag = (tagToRemove) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  // Add tag from input - because apparently we need to add things
  const addTag = () => {
    const input = document.getElementById('tag-input');
    if (input && input.value.trim()) {
      const newTag = input.value.trim();
      
      // Check if tag already exists - because apparently we don't want duplicates
      if (!watchedTags.includes(newTag)) {
        setValue('tags', [...watchedTags, newTag]);
      }
      
      input.value = '';
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

  if (loading) {
    return (
      <div className="task-form-loading">
        <div className="loading-spinner"></div>
        <p>{isEditing ? 'Loading task...' : 'Preparing form...'}</p>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h1>{isEditing ? 'Edit Task' : 'Create New Task'}</h1>
        <p>{isEditing ? 'Update your task details below' : 'Fill in the details to create a new task'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        {/* Title Field - because apparently we need a title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title..."
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 100,
                message: 'Title must be 100 characters or less'
              }
            })}
          />
          {errors.title && (
            <span className="error-message">{errors.title.message}</span>
          )}
        </div>

        {/* Description Field - because apparently we need a description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter task description..."
            rows="4"
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description must be 500 characters or less'
              }
            })}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>

        {/* Status and Priority Row - because apparently we need to organize things */}
        <div className="form-row">
          {/* Status Field - because apparently we need to know the status */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className={`form-select ${errors.status ? 'error' : ''}`}
              {...register('status')}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <span className="error-message">{errors.status.message}</span>
            )}
          </div>

          {/* Priority Field - because apparently we need to know the priority */}
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              className={`form-select ${errors.priority ? 'error' : ''}`}
              {...register('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <span className="error-message">{errors.priority.message}</span>
            )}
          </div>
        </div>

        {/* Due Date Field - because apparently we need to know when it's due */}
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            className={`form-input ${errors.dueDate ? 'error' : ''}`}
            {...register('dueDate', {
              validate: (value) => {
                if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
                  return 'Due date cannot be in the past';
                }
                return true;
              }
            })}
          />
          {errors.dueDate && (
            <span className="error-message">{errors.dueDate.message}</span>
          )}
        </div>

        {/* Tags Field - because apparently we need to categorize things */}
        <div className="form-group">
          <label htmlFor="tags" className="form-label">
            Tags
          </label>
          <div className="tags-input-container">
            <input
              type="text"
              id="tag-input"
              className="tag-input"
              placeholder="Type a tag and press Enter..."
              onKeyPress={handleTagInput}
            />
            <button
              type="button"
              className="add-tag-button"
              onClick={addTag}
            >
              Add Tag
            </button>
          </div>
          
          {/* Display existing tags - because apparently we need to see what we have */}
          {watchedTags.length > 0 && (
            <div className="tags-display">
              {watchedTags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {errors.tags && (
            <span className="error-message">{errors.tags.message}</span>
          )}
        </div>

        {/* Preview Section - because apparently we need to see what we're creating */}
        <div className="form-preview">
          <h3>Task Preview</h3>
          <div className="preview-card">
            <div className="preview-header">
              <h4>{watch('title') || 'Task Title'}</h4>
              <div className="preview-badges">
                <span className={`priority-badge ${getPriorityColor(watch('priority'))}`}>
                  {watch('priority') || 'medium'}
                </span>
                <span className={`status-badge ${getStatusColor(watch('status'))}`}>
                  {(watch('status') || 'todo').replace('_', ' ')}
                </span>
              </div>
            </div>
            
            {watch('description') && (
              <p className="preview-description">{watch('description')}</p>
            )}
            
            {watch('dueDate') && (
              <p className="preview-due-date">
                <strong>Due:</strong> {new Date(watch('dueDate')).toLocaleDateString()}
              </p>
            )}
            
            {watchedTags.length > 0 && (
              <div className="preview-tags">
                {watchedTags.map((tag, index) => (
                  <span key={index} className="preview-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions - because apparently we need to do something */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/tasks')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
