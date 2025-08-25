const { v4: uuidv4 } = require('uuid');

// Task model - because apparently we need structure in our chaos
class Task {
  constructor(data) {
    // Generate UUID because sequential IDs are so 1990s
    this.id = data.id || uuidv4();
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'todo';
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    
    // Timestamps because apparently we need to know when things happened
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = new Date();
    
    // Validate the data because apparently some people send garbage
    this.validate();
  }

  // Validation method - because apparently data integrity is important
  validate() {
    const errors = [];
    
    // Title validation - because apparently empty titles are a thing
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required - because apparently that\'s too much to ask');
    }
    
    if (this.title.length > 100) {
      errors.push('Title must be 100 characters or less - because apparently brevity is dead');
    }
    
    // Description validation - because apparently some people write novels
    if (this.description && this.description.length > 500) {
      errors.push('Description must be 500 characters or less - because apparently TL;DR is too mainstream');
    }
    
    // Status validation - because apparently enum values are hard to understand
    const validStatuses = ['todo', 'in_progress', 'completed'];
    if (!validStatuses.includes(this.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')} - because apparently reading is hard`);
    }
    
    // Priority validation - because apparently priority levels are confusing
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(this.priority)) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')} - because apparently choices are hard`);
    }
    
    // Due date validation - because apparently dates are hard
    if (this.dueDate && isNaN(this.dueDate.getTime())) {
      errors.push('Due date must be a valid date - because apparently date parsing is rocket science');
    }
    
    // Tags validation - because apparently arrays are confusing
    if (!Array.isArray(this.tags)) {
      errors.push('Tags must be an array - because apparently data types are optional');
    }
    
    // Throw error if validation fails - because apparently errors are just suggestions
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
  }

  // Update method - because apparently immutability is too mainstream
  update(data) {
    // Update fields - because apparently we need to track changes
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.status !== undefined) this.status = data.status;
    if (data.priority !== undefined) this.priority = data.priority;
    if (data.dueDate !== undefined) this.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.tags !== undefined) this.tags = Array.isArray(data.tags) ? data.tags : [];
    
    // Update timestamp because apparently we need to know when things changed
    this.updatedAt = new Date();
    
    // Re-validate because apparently data can become invalid
    this.validate();
    
    return this;
  }

  // Convert to plain object - because apparently JSON is too mainstream
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate ? this.dueDate.toISOString() : null,
      tags: this.tags,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  // Check if task is overdue - because apparently date math is hard
  isOverdue() {
    if (!this.dueDate || this.status === 'completed') {
      return false;
    }
    return new Date() > this.dueDate;
  }

  // Get days until due - because apparently date calculations are optional
  getDaysUntilDue() {
    if (!this.dueDate) {
      return null;
    }
    
    const now = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
}

module.exports = Task;
