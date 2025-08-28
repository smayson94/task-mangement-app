import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

// Create context - because apparently we need to share state
const TaskContext = createContext();

// Initial state - because apparently we need to start somewhere
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
    tags: []
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

// Action types - because apparently we need to know what actions are possible
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_SORT: 'SET_SORT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function - because apparently we need to handle state changes
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };
    
    case TASK_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case TASK_ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
        error: null
      };
    
    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        }
      };
    
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1
        }
      };
    
    case TASK_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 } // Reset to first page when filters change
      };
    
    case TASK_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
    
    case TASK_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder
      };
    
    case TASK_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Task provider component - because apparently we need to wrap our app
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [hasInitialized, setHasInitialized] = useState(false);
  const lastFetchKeyRef = React.useRef('');

  // Stabilize pagination object to prevent infinite loops
  const stablePagination = useMemo(() => ({
    page: state.pagination.page,
    limit: state.pagination.limit
  }), [state.pagination.page, state.pagination.limit]);




  // Helper function to make API calls - because apparently we need to handle HTTP requests
  const apiCall = async (method, endpoint, data = null) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Something went wrong';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Fetch tasks with filters and pagination - because apparently we need to get data
  const fetchTasks = useCallback(async (filters = {}, pagination = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params - because apparently we need to filter things
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        }
      });
      
      // Add pagination to query params - because apparently we need to paginate things
      Object.entries(pagination).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      // Add sorting to query params - because apparently we need to sort things
      queryParams.append('sortBy', state.sortBy);
      queryParams.append('sortOrder', state.sortOrder);
      
      const endpoint = `/api/tasks?${queryParams.toString()}`;
      const result = await apiCall('GET', endpoint);
      
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: result });
      return result;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    }
  }, [state.sortBy, state.sortOrder]);

  // Create new task - because apparently we need to add things
  const createTask = async (taskData) => {
    try {
      const newTask = await apiCall('POST', '/api/tasks', taskData);
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: newTask });
      toast.success('Task created successfully');
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  // Update existing task - because apparently we need to change things
  const updateTask = async (id, updateData) => {
    try {
      const updatedTask = await apiCall('PUT', `/api/tasks/${id}`, updateData);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: updatedTask });
      toast.success('Task updated successfully');
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  // Delete task - because apparently we need to remove things
  const deleteTask = async (id) => {
    try {
      await apiCall('DELETE', `/api/tasks/${id}`);
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  // Get task by ID - because apparently we need to find specific things
  const getTaskById = async (id) => {
    try {
      const task = await apiCall('GET', `/api/tasks/${id}`);
      return task;
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to fetch task');
      throw error;
    }
  };

  // Update filters - because apparently we need to filter things
  const updateFilters = (newFilters) => {
    console.log('TaskContext: Updating filters:', newFilters);
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Update pagination - because apparently we need to paginate things
  const updatePagination = (newPagination) => {
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: newPagination });
  };

  // Update sorting - because apparently we need to sort things
  const updateSort = (sortBy, sortOrder) => {
    dispatch({ type: TASK_ACTIONS.SET_SORT, payload: { sortBy, sortOrder } });
  };

  // Clear error - because apparently we need to clear errors
  const clearError = () => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
  };
    // Fetch tasks when filters, pagination, or sorting changes - guard against unnecessary repeats
    useEffect(() => {
      const fetchKey = JSON.stringify({
        filters: state.filters,
        page: stablePagination.page,
        limit: stablePagination.limit,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder
      });

      if (!hasInitialized) {
        lastFetchKeyRef.current = fetchKey;
        fetchTasks(state.filters, stablePagination);
        setHasInitialized(true);
        return;
      }

      if (lastFetchKeyRef.current !== fetchKey) {
        lastFetchKeyRef.current = fetchKey;
        fetchTasks(state.filters, stablePagination);
      }
    }, [state.filters, stablePagination, state.sortBy, state.sortOrder, fetchTasks, hasInitialized]);
  

  // Context value - because apparently we need to provide something
  const value = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    updateFilters,
    updatePagination,
    updateSort,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use task context - because apparently we need to access context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
