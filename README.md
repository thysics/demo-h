# Task Management App

A full-stack application for managing tasks with user authentication, task organization, and a clean user interface.

## Features

### User Management
- User registration and login with email/password
- Profile management (view and edit user information)
- Secure authentication with JWT tokens
- Session persistence

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete/in-progress/pending
- Set task priority (high/medium/low)
- Assign due dates to tasks
- Delete completed tasks

### Organization
- Create and manage projects/categories
- Assign tasks to projects
- Filter tasks by status, priority, project, and due date
- Search tasks by title or description
- Sort tasks by various criteria

### User Interface
- Clean, responsive web interface
- Dashboard with task statistics
- Task list view with sorting and filtering
- Simple task creation and editing forms
- Mobile-friendly design

## Project Structure

```
/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Middleware functions
│   │   ├── config/          # Configuration files
│   │   ├── utils/           # Utility functions
│   │   ├── db/              # Database setup and migrations
│   │   └── index.js         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
│
└── frontend/                # React frontend
    ├── public/              # Static files
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── utils/           # Utility functions
    │   ├── context/         # React context
    │   ├── App.js           # Main App component
    │   └── index.js         # Entry point
    └── package.json         # Frontend dependencies
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-management-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   DB_PATH=./src/db/database.sqlite
   ```

4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
   The API server will run on http://localhost:5000.

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```
   The React application will run on http://localhost:3000.

3. Open your browser and navigate to http://localhost:3000 to use the application.

#### Production Mode

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Start the backend server:
   ```
   cd ../backend
   npm start
   ```

3. Access the application at http://localhost:5000.

## Using the Application

### Getting Started

1. Register a new account using the "Register" link.
2. Log in with your credentials.
3. You'll be redirected to the dashboard, which shows an overview of your tasks.

### Managing Tasks

1. Navigate to the "Tasks" page to see all your tasks.
2. Use the "Create New Task" button to add a new task.
3. Fill in the task details (title, description, status, priority, due date, project).
4. Use the filter options to find specific tasks.
5. Click on a task to edit, delete, or change its status.

### Managing Projects

1. Navigate to the "Projects" page to see all your projects.
2. Use the "Create New Project" button to add a new project.
3. Fill in the project details (name, description).
4. Click on a project to view its details and associated tasks.
5. Add tasks directly to a project from the project detail page.

## API Endpoints

### User Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get the current user's profile

### Task Management

- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Project Management

- `GET /api/projects` - Get all projects for the authenticated user
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/projects/:id/tasks` - Get all tasks for a specific project

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- User data isolation (users can only access their own data)
- Input validation and sanitization
- Protected API endpoints

## Technical Details

- Backend: Node.js with Express.js
- Frontend: React with React Router
- Database: SQLite
- Authentication: JWT (JSON Web Tokens)
- State Management: React Context API