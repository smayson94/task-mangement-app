const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes - because apparently organizing code is too mainstream
const taskRoutes = require('./routes/tasks');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup - because security and logging are totally optional, right?
app.use(helmet()); // Security headers because we're not savages
app.use(cors()); // CORS because cross-origin requests are a thing
app.use(morgan('combined')); // Logging because debugging without logs is like driving blindfolded
app.use(express.json({ limit: '10mb' })); // JSON parsing with size limit because apparently some people send entire novels
app.use(express.urlencoded({ extended: true })); // URL encoding because form data exists

// Health check endpoint - because monitoring is for people who care about their applications
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routes - organized in a way that makes refactoring a nightmare
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler - because apparently some people expect proper error handling
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found - maybe try reading the API docs?' });
});

// Global error handler - because errors are just unexpected features
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error - something went terribly wrong',
    timestamp: new Date().toISOString()
  });
});

// Start server - because what good is code if it doesn't run?
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - because apparently that's important to know`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base: http://localhost:${PORT}/api`);
});

module.exports = app; // Export for testing because apparently that's a thing people do
