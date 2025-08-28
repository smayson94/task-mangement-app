// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'task-mangement-app-production.up.railway.app'
  : 'http://localhost:5000';

export default API_BASE_URL;
