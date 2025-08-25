import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const { tasks, loading, updateTask } = useTaskContext();
  const navigate = useNavigate();
  
  // Stable column structure
  const [columns, setColumns] = useState({
    todo: [],
    in_progress: [],
    completed: []
  });

  // Update columns only when tasks change
  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      const validTasks = tasks.filter(task => 
        task && 
        task.id && 
        typeof task.id === 'string' && 
        task.status && 
        ['todo', 'in_progress', 'completed'].includes(task.status)
      );
      
      const newColumns = {
        todo: validTasks.filter(task => task.status === 'todo'),
        in_progress: validTasks.filter(task => task.status === 'in_progress'),
        completed: validTasks.filter(task => task.status === 'completed')
      };
      
      setColumns(newColumns);
    }
  }, [tasks]);

  // Handle task status change via click
  const handleStatusChange = useCallback(async (taskId, newStatus) => {
    try {
      console.log('Changing task status:', { taskId, newStatus });
      await updateTask(taskId, { status: newStatus });
      
      // Update local state immediately for better UX
      setColumns(prev => {
        const newColumns = { ...prev };
        
        // Remove task from all columns first
        Object.keys(newColumns).forEach(colKey => {
          newColumns[colKey] = newColumns[colKey].filter(task => task.id !== taskId);
        });
        
        // Find the task to move
        let taskToMove = null;
        Object.values(prev).forEach(col => {
          const found = col.find(t => t.id === taskId);
          if (found) taskToMove = found;
        });
        
        if (taskToMove) {
          // Add to new column with updated status
          newColumns[newStatus] = [...newColumns[newStatus], { ...taskToMove, status: newStatus }];
        }
        
        return newColumns;
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, [updateTask]);

  // Handle task click to view details
  const handleTaskClick = useCallback((taskId) => {
    navigate(`/tasks/${taskId}`);
  }, [navigate]);

  // Get priority color and icon
  const getPriorityInfo = useCallback((priority) => {
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
  }, []);

  // Check if task is overdue
  const isOverdue = useCallback((dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }, []);

  // Get completion delay for completed tasks
  const getCompletionDelay = useCallback((dueDate, completedAt) => {
    if (!dueDate || !completedAt) return null;
    const due = new Date(dueDate);
    const completed = new Date(completedAt);
    const diffTime = completed - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // Format due date with completion info
  const formatDueDate = useCallback((dueDate, task) => {
    if (!dueDate) return null;
    
    if (task.status === 'completed') {
      const delay = getCompletionDelay(dueDate, task.updatedAt);
      if (delay > 0) {
        return `Completed ${delay} day${delay > 1 ? 's' : ''} late`;
      } else if (delay === 0) {
        return 'Completed on time';
      } else {
        return `Completed ${Math.abs(delay)} day${Math.abs(delay) > 1 ? 's' : ''} early`;
      }
    }
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [getCompletionDelay]);

  // Column configurations
  const columnConfig = {
    todo: { title: 'To Do', icon: '📋', color: '#3b82f6', bg: '#eff6ff', nextStatus: 'in_progress' },
    in_progress: { title: 'In Progress', icon: '⚡', color: '#f59e0b', bg: '#fffbeb', nextStatus: 'completed' },
    completed: { title: 'Done', icon: '✅', color: '#10b981', bg: '#f0fdf4', nextStatus: 'todo' }
  };

  // Show loading state while loading
  if (loading) {
    return (
      <div className="kanban-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading your tasks...</p>
      </div>
    );
  }

  // Ensure columns are valid
  if (!columns || !columns.todo || !columns.in_progress || !columns.completed) {
    return (
      <div className="kanban-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Preparing board...</p>
      </div>
    );
  }

  console.log('Rendering Kanban board with columns:', columns);

  return (
    <div className="kanban-board">
      <motion.div
        className="kanban-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Task Board</h1>
        <p>Click the arrow buttons to move tasks between columns</p>
      </motion.div>

      <div className="kanban-columns">
        {Object.entries(columns).map(([columnId, columnTasks]) => {
          const config = columnConfig[columnId];
          
          return (
            <motion.div
              key={columnId}
              className="kanban-column"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: columnId === 'todo' ? 0 : columnId === 'in_progress' ? 0.2 : 0.4 }}
            >
              <div className="column-header" style={{ backgroundColor: config.bg }}>
                <div className="column-title">
                  <span className="column-icon">{config.icon}</span>
                  <h3>{config.title}</h3>
                </div>
                <motion.span
                  className="task-count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  {columnTasks.length}
                </motion.span>
              </div>

              <div className="column-content">
                <AnimatePresence>
                  {columnTasks.map((task, index) => {
                    const priorityInfo = getPriorityInfo(task.priority);
                    const overdue = isOverdue(task.dueDate);
                    const dueDateText = formatDueDate(task.dueDate, task);
                    
                    return (
                      <motion.div
                        key={task.id}
                        className="task-card"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        whileHover={{ 
                          y: -4, 
                          scale: 1.02,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20 
                        }}
                      >
                        {/* Priority indicator */}
                        <div 
                          className="priority-indicator"
                          style={{ 
                            backgroundColor: priorityInfo.bg,
                            borderColor: priorityInfo.color
                          }}
                        >
                          <span className="priority-icon">{priorityInfo.icon}</span>
                        </div>

                        {/* Task content */}
                        <div className="task-content">
                          <h4 className="task-title">{task.title}</h4>
                          
                          {task.description && (
                            <p className="task-description">
                              {task.description.length > 100 
                                ? `${task.description.substring(0, 100)}...` 
                                : task.description
                              }
                            </p>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="task-tags">
                              {task.tags.slice(0, 3).map((tag, index) => (
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
                              {task.tags.length > 3 && (
                                <span className="tag-more">+{task.tags.length - 3}</span>
                              )}
                            </div>
                          )}

                                                  {/* Due date */}
                        {dueDateText && (
                          <div className={`due-date ${overdue && task.status !== 'completed' ? 'overdue' : ''}`}>
                            <span className="due-icon">📅</span>
                            <span className="due-text">{dueDateText}</span>
                            {overdue && task.status !== 'completed' && (
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
                        </div>

                        {/* Action buttons */}
                        <div className="task-actions">
                          {/* View Task Button */}
                          <motion.button
                            className="action-button view-task"
                            onClick={() => handleTaskClick(task.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="View Task Details"
                          >
                            👁️
                          </motion.button>
                          
                          {/* Status Change Buttons */}
                          <motion.button
                            className="action-button next-status"
                            onClick={() => handleStatusChange(task.id, config.nextStatus)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title={`Move to ${columnConfig[config.nextStatus].title}`}
                          >
                            {columnId === 'completed' ? '🔄' : '➡️'}
                          </motion.button>
                          
                          {columnId !== 'todo' && (
                            <motion.button
                              className="action-button prev-status"
                              onClick={() => handleStatusChange(task.id, columnId === 'completed' ? 'in_progress' : 'todo')}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title={`Move to ${columnId === 'completed' ? 'In Progress' : 'To Do'}`}
                            >
                              ⬅️
                            </motion.button>
                          )}
                        </div>

                        {/* Completion checkmark animation */}
                        {columnId === 'completed' && (
                          <motion.div
                            className="completion-checkmark"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 200, 
                              damping: 10,
                              delay: 0.3
                            }}
                          >
                            🎉
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
