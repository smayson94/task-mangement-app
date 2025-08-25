const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const taskService = require('../services/taskService');

const router = express.Router();

// Validation middleware - because apparently some people send garbage data
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed - because apparently data validation is optional',
      details: errors.array()
    });
  }
  next();
};

// GET /api/tasks - Get all tasks with filtering and pagination
// Because apparently we need to retrieve things
router.get('/', [
  // Query parameter validation - because apparently query strings are hard to validate
  query('status').optional().isIn(['todo', 'in_progress', 'completed']).withMessage('Invalid status value'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
  query('search').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Search term must be 1-100 characters'),
  query('tags').optional().isArray().withMessage('Tags must be an array'),
  query('sortBy').optional().isIn(['title', 'priority', 'dueDate', 'createdAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Extract query parameters - because apparently we need to parse them
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
      tags: req.query.tags,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || 'asc'
    };
    
    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };
    
    // Get tasks from service - because apparently we need to delegate work
    const result = await taskService.getTasks(filters, pagination);
    
    // Return results - because apparently we need to send data back
    res.json(result);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error getting tasks:', error);
    res.status(500).json({
      error: 'Failed to retrieve tasks - because apparently something went wrong',
      message: error.message
    });
  }
});

// GET /api/tasks/:id - Get task by ID
// Because apparently we need to find specific things
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid task ID format'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Get task by ID - because apparently we need to find specific things
    const task = await taskService.getTaskById(req.params.id);
    
    // Return task - because apparently we need to send data back
    res.json(task);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Task not found - because apparently that ID doesn\'t exist',
        message: error.message
      });
    }
    
    console.error('Error getting task:', error);
    res.status(500).json({
      error: 'Failed to retrieve task - because apparently something went wrong',
      message: error.message
    });
  }
});

// POST /api/tasks - Create new task
// Because apparently we need to add things
router.post('/', [
  // Body validation - because apparently request bodies are hard to validate
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be 1-100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be 500 characters or less'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Status must be todo, in_progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be 1-50 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Create task - because apparently we need to add things
    const task = await taskService.createTask(req.body);
    
    // Return created task - because apparently we need to know what we created
    res.status(201).json(task);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({
        error: 'Validation failed - because apparently data validation is optional',
        message: error.message
      });
    }
    
    console.error('Error creating task:', error);
    res.status(500).json({
      error: 'Failed to create task - because apparently something went wrong',
      message: error.message
    });
  }
});

// PUT /api/tasks/:id - Update task
// Because apparently things change
router.put('/:id', [
  param('id').isUUID().withMessage('Invalid task ID format'),
  // Body validation - because apparently request bodies are hard to validate
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be 500 characters or less'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Status must be todo, in_progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be 1-50 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Update task - because apparently we need to change things
    const task = await taskService.updateTask(req.params.id, req.body);
    
    // Return updated task - because apparently we need to know what we changed
    res.json(task);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Task not found - because apparently that ID doesn\'t exist',
        message: error.message
      });
    }
    
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({
        error: 'Validation failed - because apparently data validation is optional',
        message: error.message
      });
    }
    
    console.error('Error updating task:', error);
    res.status(500).json({
      error: 'Failed to update task - because apparently something went wrong',
      message: error.message
    });
  }
});

// PATCH /api/tasks/:id - Partial update task
// Because apparently PUT is too mainstream
router.patch('/:id', [
  param('id').isUUID().withMessage('Invalid task ID format'),
  // Body validation - because apparently request bodies are hard to validate
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be 500 characters or less'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Status must be todo, in_progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be 1-50 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Update task - because apparently we need to change things
    const task = await taskService.updateTask(req.params.id, req.body);
    
    // Return updated task - because apparently we need to know what we changed
    res.json(task);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Task not found - because apparently that ID doesn\'t exist',
        message: error.message
      });
    }
    
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({
        error: 'Validation failed - because apparently data validation is optional',
        message: error.message
      });
    }
    
    console.error('Error updating task:', error);
    res.status(500).json({
      error: 'Failed to update task - because apparently something went wrong',
      message: error.message
    });
  }
});

// DELETE /api/tasks/:id - Delete task
// Because apparently we need to remove things
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid task ID format'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Delete task - because apparently we need to remove things
    const result = await taskService.deleteTask(req.params.id);
    
    // Return success message - because apparently we need to know it worked
    res.json(result);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Task not found - because apparently that ID doesn\'t exist',
        message: error.message
      });
    }
    
    console.error('Error deleting task:', error);
    res.status(500).json({
      error: 'Failed to delete task - because apparently something went wrong',
      message: error.message
    });
  }
});

// DELETE /api/tasks - Clear all tasks (dangerous operation)
// Because apparently we need to start over sometimes
router.delete('/', async (req, res) => {
  try {
    // Clear all tasks - because apparently we need to start over
    const result = await taskService.clearAllTasks();
    
    // Return success message - because apparently we need to know it worked
    res.json(result);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error clearing tasks:', error);
    res.status(500).json({
      error: 'Failed to clear tasks - because apparently something went wrong',
      message: error.message
    });
  }
});

module.exports = router;
