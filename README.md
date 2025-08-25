# TaskMaster - Full-Stack Task Management Application

A comprehensive task management application built with Node.js backend and React frontend, featuring full CRUD operations, filtering, sorting, and analytics.

## 🚀 Features

### Core Functionality
- **Create, Read, Update, Delete (CRUD)** operations for tasks
- **Task Management** with title, description, priority, status, due dates, and tags
- **Advanced Filtering** by status, priority, tags, and text search
- **Sorting** by title, priority, due date, and creation date
- **Pagination** for large task lists
- **Real-time Search** across task titles and descriptions

### Task Properties
- **Title** (required, max 100 characters)
- **Description** (optional, max 500 characters)
- **Status** (todo, in_progress, completed)
- **Priority** (low, medium, high)
- **Due Date** (optional, with overdue detection)
- **Tags** (optional, for categorization)
- **Timestamps** (created, updated)

### Analytics & Statistics
- **Dashboard Overview** with key metrics
- **Status Distribution** charts
- **Priority Analysis** visualization
- **Tag Usage** statistics
- **Completion Trends** over time
- **Overdue Task** monitoring

### User Experience
- **Responsive Design** for desktop and mobile
- **Modern UI/UX** with smooth animations
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Bulk Operations** for multiple tasks
- **Quick Actions** for common tasks

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **UUID** - Unique identifier generation
- **Jest** - Testing framework
- **Supertest** - API testing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Date-fns** - Date utilities
- **CSS3** - Styling with custom components

### Development Tools
- **ESLint** - Code linting
- **Git** - Version control
- **Nodemon** - Development server
- **Create React App** - Frontend build tool

## 📁 Project Structure

```
task-management-app/
├── backend/                 # Node.js backend
│   ├── models/             # Data models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── tests/              # Unit tests
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── context/        # State management
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🔧 Development

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Start production server
npm start
```

### Frontend Development

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Tasks
- `GET /tasks` - Get all tasks with filtering and pagination
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `PATCH /tasks/:id` - Partial update task
- `DELETE /tasks/:id` - Delete task
- `DELETE /tasks` - Clear all tasks

#### Statistics
- `GET /stats` - Get task statistics
- `GET /stats/overdue` - Get overdue tasks
- `GET /stats/status/:status` - Get tasks by status
- `GET /stats/priority/:priority` - Get tasks by priority
- `GET /stats/tags` - Get tag statistics
- `GET /stats/completion-trend` - Get completion trends

### Query Parameters

#### Filtering
- `status` - Filter by task status
- `priority` - Filter by priority level
- `search` - Search in title and description
- `tags` - Filter by tags (array)

#### Sorting
- `sortBy` - Sort field (title, priority, dueDate, createdAt)
- `sortOrder` - Sort direction (asc, desc)

#### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Example Requests

```bash
# Get high priority tasks
GET /api/tasks?priority=high

# Search for tasks containing "documentation"
GET /api/tasks?search=documentation

# Get tasks sorted by due date (earliest first)
GET /api/tasks?sortBy=dueDate&sortOrder=asc

# Get second page of tasks
GET /api/tasks?page=2&limit=5
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

Tests cover:
- Task creation and validation
- Task retrieval and filtering
- Task updates and deletion
- Statistics calculation
- Error handling

### Frontend Tests
```bash
cd frontend
npm test
```

Tests cover:
- Component rendering
- User interactions
- Form validation
- State management

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to various platforms:

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### Heroku
1. Create a new Heroku app
2. Connect your repository
3. Set buildpacks and environment variables

#### DigitalOcean App Platform
1. Connect your repository
2. Configure build settings
3. Set environment variables

### Frontend Deployment

#### Netlify
1. Connect your GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`

#### Vercel
1. Import your GitHub repository
2. Set root directory to `frontend`
3. Deploy automatically

### Environment Variables

#### Backend
```env
PORT=5000
NODE_ENV=production
```

#### Frontend
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **Input validation** with express-validator
- **Rate limiting** (can be added)
- **Authentication** (can be extended)

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 UI/UX Features

- **Modern Design** with clean aesthetics
- **Smooth Animations** and transitions
- **Consistent Color Scheme** and typography
- **Interactive Elements** with hover effects
- **Loading States** and skeleton screens
- **Toast Notifications** for user feedback

## 🔮 Future Enhancements

- **User Authentication** and authorization
- **Database Integration** (PostgreSQL, MongoDB)
- **Real-time Updates** with WebSockets
- **File Attachments** for tasks
- **Team Collaboration** features
- **Mobile App** (React Native)
- **Advanced Analytics** and reporting
- **Email Notifications** for due dates
- **Calendar Integration** (Google Calendar, Outlook)
- **API Rate Limiting** and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for modern web development practices.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 📊 Performance

- **Backend**: Optimized for in-memory operations
- **Frontend**: Lazy loading and code splitting ready
- **Database**: Prepared for future database integration
- **Caching**: Ready for Redis integration

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in backend/server.js
   - Update frontend proxy in package.json

2. **CORS errors**
   - Check backend CORS configuration
   - Verify frontend proxy settings

3. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

4. **API connection issues**
   - Verify backend is running
   - Check API base URL configuration

---

**Happy Task Managing! 🎯**
