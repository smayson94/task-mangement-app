import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Import components - because apparently we need to organize things
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MinimalDashboard from './components/MinimalDashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import Statistics from './components/Statistics';

// Import context - because apparently we need to share state
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="App">
          {/* Header component - because apparently we need navigation */}
          <Header />
          
          {/* Main content area - because apparently we need to show something */}
          <main className="main-content">
            <Routes>
              {/* Dashboard route - because apparently we need a home page */}
              <Route path="/" element={<MinimalDashboard />} />
              
              {/* Alternative dashboard route */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Kanban board route - because apparently we need a visual workflow */}
              <Route path="/kanban" element={<KanbanBoard />} />
              
              {/* Task list route - because apparently we need to see all tasks */}
              <Route path="/tasks" element={<TaskList />} />
              
              {/* Task creation route - because apparently we need to add things */}
              <Route path="/tasks/new" element={<TaskForm />} />
              
              {/* Task editing route - because apparently we need to change things */}
              <Route path="/tasks/:id/edit" element={<TaskForm />} />
              
              {/* Task detail route - because apparently we need to see specific things */}
              <Route path="/tasks/:id" element={<TaskDetail />} />
              
              {/* Statistics route - because apparently we need to see how we're doing */}
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </main>
          
          {/* Toast notifications - because apparently we need to know when things happen */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;
