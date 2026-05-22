# Team Task Manager - Setup & Deployment Guide

## Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set these values:

   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

---

## Project Structure

```
TeamTaskManager/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middlewares/           # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                # MongoDB schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── server.js              # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── Tasks.jsx
│   │   ├── contexts/          # Auth state management
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API client
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
└── README.md
```

---

## API Endpoints

### Authentication

- **Register:** `POST /api/auth/register`

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Login:** `POST /api/auth/login`
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

Response includes `user` object and `token`.

### Users

- **Get Current User:** `GET /api/users/me`
  - Requires: Bearer token

### Projects (Admin only for create/delete)

- **Create:** `POST /api/projects`

  ```json
  {
    "name": "Project Name",
    "description": "Project description"
  }
  ```

- **Get All:** `GET /api/projects`

- **Get by ID:** `GET /api/projects/:id`

- **Update:** `PUT /api/projects/:id`

  ```json
  {
    "name": "Updated Name",
    "description": "Updated description"
  }
  ```

- **Delete:** `DELETE /api/projects/:id`

- **Add Member:** `POST /api/projects/:id/add-member`
  ```json
  {
    "email": "user@example.com"
  }
  ```

### Tasks (Create/Delete: Admin only)

- **Create:** `POST /api/tasks`

  ```json
  {
    "title": "Task Title",
    "description": "Task details",
    "projectId": "625f7c0b9a0c1d001a2b3c4d",
    "assignedTo": "625f7c0b9a0c1d001a2b3c4e",
    "dueDate": "2025-12-31"
  }
  ```

- **Get All:** `GET /api/tasks`

- **Update:** `PUT /api/tasks/:id`

  ```json
  {
    "title": "Updated Title",
    "description": "Updated details",
    "status": "in-progress"
  }
  ```

- **Delete:** `DELETE /api/tasks/:id`

---

## Features

### Authentication & Authorization

- Email-based registration and login
- JWT token-based authentication
- Persistent login using localStorage
- Role-based access (Admin / Member)

### Project Management

- Create/update/delete projects (Admin only)
- Add team members to projects
- View team member details
- Track project tasks

### Task Management

- Create tasks and assign to team members
- Update task status (todo / in-progress / completed)
- Filter tasks by status and project
- View overdue tasks
- Display task details with deadlines

### Dashboard

- User greeting and role display
- Task metrics (total, completed, pending, overdue)
- Quick project overview
- Recent task summary

### UI/UX

- Clean, modern design with Tailwind CSS
- Responsive layouts (mobile, tablet, desktop)
- Status badges for quick identification
- Form validation (frontend & backend)
- Error handling and user feedback

---

## Deployment to Railway (Backend)

1. Push your repository to GitHub

2. Connect Railway to your GitHub account:
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

3. Configure environment variables in Railway:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`

4. Railway automatically deploys on every push to main

5. Your API URL will be like: `https://your-app-name.railway.app/api`

---

## Deployment to Vercel (Frontend)

1. Push your repository to GitHub

2. Go to [Vercel.com](https://vercel.com) and sign in

3. Click "Import Project" and select your GitHub repo

4. Set the deployment settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add environment variable:
   - `VITE_API_URL`: Your Railway backend URL

6. Click "Deploy"

---

## Security Best Practices

- Use strong JWT secrets
- Enable HTTPS on deployed URLs
- Hash passwords with bcrypt (already implemented)
- Validate input on both frontend and backend
- Use environment variables for sensitive data
- Implement rate limiting for production (optional)

---

## Troubleshooting

### Backend won't connect to MongoDB

- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access (whitelist your IP)
- Ensure cluster user has correct permissions

### Frontend can't reach backend

- Verify `VITE_API_URL` is correct
- Check backend CORS settings
- Ensure both servers are running

### Authentication issues

- Clear localStorage and try again
- Check JWT_SECRET matches backend
- Verify token expiration (7 days default)

---

## Next Steps (Optional Enhancements)

- Add email notifications
- Implement Kanban drag-and-drop board
- Add task comments and activity logs
- Add Dark mode toggle
- Implement file attachments on tasks
- Add real-time updates with Socket.io
- Create admin dashboard with analytics
