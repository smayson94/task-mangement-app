const express = require('express');
const taskService = require('../services/taskService');

const router = express.Router();

// GET /api/stats - Get task statistics
// Because apparently we need to know how many things we have
router.get('/', async (req, res) => {
  try {
    // Get statistics from service - because apparently we need to delegate work
    const stats = await taskService.getTaskStats();
    
    // Return statistics - because apparently we need to send data back
    res.json(stats);
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error getting statistics:', error);
    res.status(500).json({
      error: 'Failed to retrieve statistics - because apparently something went wrong',
      message: error.message
    });
  }
});

// GET /api/stats/overdue - Get overdue tasks
// Because apparently we need to know what's late
router.get('/overdue', async (req, res) => {
  try {
    // Get all tasks - because apparently we need to filter them
    const result = await taskService.getTasks();
    
    // Filter overdue tasks - because apparently we need to find what's late
    const overdueTasks = result.tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') {
        return false;
      }
      return new Date() > new Date(task.dueDate);
    });
    
    // Return overdue tasks - because apparently we need to send data back
    res.json({
      count: overdueTasks.length,
      tasks: overdueTasks
    });
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error getting overdue tasks:', error);
    res.status(500).json({
      error: 'Failed to retrieve overdue tasks - because apparently something went wrong',
      message: error.message
    });
  }
});

// GET /api/stats/status/:status - Get tasks by status
// Because apparently we need to categorize things
router.get('/status/:status', async (req, res) => {
  try {
    const status = req.params.status;
    
    // Validate status - because apparently some people send garbage data
    const validStatuses = ['todo', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status - because apparently reading the API docs is optional',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    // Get tasks by status - because apparently we need to filter them
    const result = await taskService.getTasks({ status });
    
    // Return filtered tasks - because apparently we need to send data back
    res.json({
      status,
      count: result.tasks.length,
      tasks: result.tasks
    });
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error getting tasks by status:', error);
    res.status(500).json({
      error: 'Failed to retrieve tasks by status - because apparently something went wrong',
      message: error.message
    });
  }
});

// GET /api/stats/priority/:priority - Get tasks by priority
// Because apparently we need to prioritize things
router.get('/priority/:priority', async (req, res) => {
  try {
    const priority = req.params.priority;
    
    // Validate priority - because apparently some people send garbage data
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        error: 'Invalid priority - because apparently reading the API docs is optional',
        message: `Priority must be one of: ${validPriorities.join(', ')}`
      });
    }
    
    // Get tasks by priority - because apparently we need to filter them
    const result = await taskService.getTasks({ priority });
    
    // Return filtered tasks - because apparently we need to send data back
    res.json({
      priority,
      count: result.tasks.length,
      tasks: result.tasks
    });
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error getting tasks by priority:', error);
    res.status(500).json({
      error: 'Failed to retrieve tasks by priority - because apparently something went wrong',
      message: error.message
    });
  }
});

// GET /api/stats/tags - Get tag statistics
// Because apparently we need to know what tags people use
router.get('/tags', async (req, res) => {
  try {
    // Get all tasks - because apparently we need to analyze them
    const result = await taskService.getTasks();
    
    // Count tags - because apparently we need to know what's popular
    const tagCounts = {};
    result.tasks.forEach(task => {
      task.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Convert to array and sort - because apparently order matters
    const tagStats = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
    
    // Return tag statistics - because apparently we need to send data back
    res.json({
      totalTags: Object.keys(tagCounts).length,
      tagCounts,
      tagStats
    });
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error getting tag statistics:', error);
    res.status(500).json({
      error: 'Failed to retrieve tag statistics - because apparently something went wrong',
      message: error.message
    });
  }
});

// GET /api/stats/completion-trend - Get completion trend over time
// Because apparently we need to know if we're getting better
router.get('/completion-trend', async (req, res) => {
  try {
    // Get all tasks - because apparently we need to analyze them
    const result = await taskService.getTasks();
    
    // Group tasks by creation date - because apparently we need to see trends
    const tasksByDate = {};
    result.tasks.forEach(task => {
      const date = new Date(task.createdAt).toISOString().split('T')[0];
      if (!tasksByDate[date]) {
        tasksByDate[date] = { total: 0, completed: 0 };
      }
      tasksByDate[date].total++;
      if (task.status === 'completed') {
        tasksByDate[date].completed++;
      }
    });
    
    // Convert to array and sort - because apparently order matters
    const trendData = Object.entries(tasksByDate)
      .map(([date, stats]) => ({
        date,
        total: stats.total,
        completed: stats.completed,
        completionRate: stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Return trend data - because apparently we need to send data back
    res.json({
      trendData,
      totalDays: trendData.length
    });
  } catch (error) {
    // Handle errors - because apparently error handling is important
    console.error('Error getting completion trend:', error);
    res.status(500).json({
      error: 'Failed to retrieve completion trend - because apparently something went wrong',
      message: error.message
    });
  }
});

module.exports = router;
