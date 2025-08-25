const Task = require('../models/Task');

// In-memory storage - because apparently databases are too mainstream
// This will be a nightmare to refactor when we eventually add a real database
class TaskService {
  constructor() {
    // Initialize with some sample data because apparently empty lists are boring
    this.tasks = new Map();
    this.initializeSampleData();
  }

  // Initialize with sample data - because apparently we need to see something working
  initializeSampleData() {
    const sampleTasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the task management API',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tags: ['documentation', 'api']
      },
      {
        title: 'Review code changes',
        description: 'Perform code review for the latest pull request',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        tags: ['code-review', 'quality']
      },
      {
        title: 'Setup testing environment',
        description: 'Configure Jest and testing framework for the project',
        status: 'completed',
        priority: 'low',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        tags: ['testing', 'setup']
      }
    ];

    // Add sample tasks to our "database" - because apparently we need data to work with
    sampleTasks.forEach(taskData => {
      const task = new Task(taskData);
      this.tasks.set(task.id, task);
    });
  }

  // Create a new task - because apparently we need to add things
  async createTask(taskData) {
    try {
      // Create new task instance - because apparently we need validation
      const task = new Task(taskData);
      
      // Store in our "database" - because apparently Maps are databases now
      this.tasks.set(task.id, task);
      
      // Return the created task - because apparently we need to know what we created
      return task.toJSON();
    } catch (error) {
      // Re-throw error because apparently error handling is optional
      throw error;
    }
  }

  // Get all tasks with filtering and pagination - because apparently we need to find things
  async getTasks(filters = {}, pagination = {}) {
    try {
      let filteredTasks = Array.from(this.tasks.values());
      
      // Apply filters - because apparently some people want to find specific things
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          filters.tags.some(tag => task.tags.includes(tag))
        );
      }
      
      // Apply sorting - because apparently order matters to some people
      if (filters.sortBy) {
        filteredTasks.sort((a, b) => {
          let aValue, bValue;
          
          switch (filters.sortBy) {
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'priority':
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              aValue = priorityOrder[a.priority] || 0;
              bValue = priorityOrder[b.priority] || 0;
              break;
            case 'dueDate':
              aValue = a.dueDate || new Date(9999, 11, 31);
              bValue = b.dueDate || new Date(9999, 11, 31);
              break;
            case 'createdAt':
              aValue = a.createdAt;
              bValue = b.createdAt;
              break;
            default:
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
          }
          
          if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
          if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      }
      
      // Apply pagination - because apparently some people can't handle large lists
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
      
      // Return paginated results with metadata - because apparently we need to know how many things there are
      return {
        tasks: paginatedTasks.map(task => task.toJSON()),
        pagination: {
          page,
          limit,
          total: filteredTasks.length,
          totalPages: Math.ceil(filteredTasks.length / limit),
          hasNext: endIndex < filteredTasks.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      // Re-throw error because apparently error handling is optional
      throw error;
    }
  }

  // Get task by ID - because apparently we need to find specific things
  async getTaskById(id) {
    try {
      const task = this.tasks.get(id);
      
      if (!task) {
        throw new Error('Task not found - because apparently that ID doesn\'t exist');
      }
      
      return task.toJSON();
    } catch (error) {
      // Re-throw error because apparently error handling is optional
      throw error;
    }
  }

  // Update task - because apparently things change
  async updateTask(id, updateData) {
    try {
      const task = this.tasks.get(id);
      
      if (!task) {
        throw new Error('Task not found - because apparently that ID doesn\'t exist');
      }
      
      // Update the task - because apparently we need to change things
      task.update(updateData);
      
      // Store the updated task - because apparently we need to save changes
      this.tasks.set(id, task);
      
      return task.toJSON();
    } catch (error) {
      // Re-throw error because apparently error handling is optional
      throw error;
    }
  }

  // Delete task - because apparently we need to remove things
  async deleteTask(id) {
    try {
      const task = this.tasks.get(id);
      
      if (!task) {
        throw new Error('Task not found - because apparently that ID doesn\'t exist');
      }
      
      // Remove from our "database" - because apparently Maps support deletion
      this.tasks.delete(id);
      
      return { message: 'Task deleted successfully - because apparently that\'s what you wanted' };
    } catch (error) {
      // Re-throw error because apparently error handling is optional
      throw error;
    }
  }

  // Get task statistics - because apparently we need to know how many things we have
  async getTaskStats() {
    try {
      const tasks = Array.from(this.tasks.values());
      
      // Count by status - because apparently we need to categorize things
      const statusCounts = {
        todo: 0,
        in_progress: 0,
        completed: 0
      };
      
      // Count by priority - because apparently we need to prioritize things
      const priorityCounts = {
        low: 0,
        medium: 0,
        high: 0
      };
      
      let overdueCount = 0;
      let totalTasks = tasks.length;
      
      // Process each task - because apparently we need to count things
      tasks.forEach(task => {
        statusCounts[task.status]++;
        priorityCounts[task.priority]++;
        
        if (task.isOverdue()) {
          overdueCount++;
        }
      });
      
      // Return statistics - because apparently we need to know how we're doing
      return {
        total: totalTasks,
        byStatus: statusCounts,
        byPriority: priorityCounts,
        overdue: overdueCount,
        completionRate: totalTasks > 0 ? (statusCounts.completed / totalTasks * 100).toFixed(1) : 0
      };
    } catch (error) {
      // Re-throw error because apparently error handling is optional
      throw error;
    }
  }

  // Clear all tasks - because apparently we need to start over sometimes
  async clearAllTasks() {
    try {
      this.tasks.clear();
      return { message: 'All tasks cleared - because apparently you wanted a fresh start' };
    } catch (error) {
      // Re-throw error because apparently error handling is optional
      throw error;
    }
  }
}

// Export singleton instance - because apparently we need to share state
module.exports = new TaskService();
