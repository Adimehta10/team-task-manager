# ⚡ TaskFlow — Team Task Manager

A full-stack Team Task Management web application built with React, Node.js, Express, and MongoDB.
Think of it as a simplified version of Trello or Asana — where teams can create projects, assign tasks, and track progress in real time.

---

## 🌐 Live Demo

- **Frontend:** https://illustrious-inspiration-production-80d7.up.railway.app
- **Backend API:** https://team-task-manager-production-686a.up.railway.app

---

## 🚀 Features

- **User Authentication** — Signup, Login with JWT-based secure sessions
- **Project Management** — Create projects, add/remove members
- **Role-Based Access** — Admin (full control) and Member (view & update assigned tasks)
- **Task Management** — Create tasks with Title, Description, Due Date, Priority, and Status
- **Kanban Board** — Visualize tasks in To Do / In Progress / Done columns
- **Dashboard** — View total tasks, tasks by status, tasks per user, and overdue tasks
- **Fully Deployed** — Live on Railway with MongoDB Atlas database

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (NoSQL) with Mongoose |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| Deployment | Railway |
| Version Control | GitHub |

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js          # User schema
│   │   │   ├── Project.js       # Project schema
│   │   │   └── Task.js          # Task schema
│   │   ├── routes/
│   │   │   ├── auth.js          # Signup, Login, Me routes
│   │   │   ├── projects.js      # Project CRUD routes
│   │   │   ├── tasks.js         # Task CRUD routes
│   │   │   └── dashboard.js     # Dashboard stats routes
│   │   └── index.js             # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js        # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.js   # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Signup.js        # Signup page
│   │   │   ├── ProjectList.js   # All projects page
│   │   │   ├── ProjectDetail.js # Kanban board page
│   │   │   └── Dashboard.js     # Stats dashboard page
│   │   ├── utils/
│   │   │   └── api.js           # Axios instance with auth
│   │   ├── App.js               # Routes and layout
│   │   └── App.css              # Global styles
│   └── package.json
└── README.md
```

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free) or local MongoDB
- Git installed

---

### 1. Clone the Repository

```bash
git clone https://github.com/Adimehta10/team-task-manager.git
cd team-task-manager
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects/:id/members` | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/project/:projectId` | Get tasks for project |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/:projectId` | Get project stats |

---

## 🚢 Deployment

Both frontend and backend are deployed on **Railway**.

### Backend Deployment
- Root Directory: `backend`
- Start Command: `npm start`
- Environment variables set in Railway dashboard

### Frontend Deployment
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Start Command: `npx serve -s build -l 3000`
- Environment variable: `REACT_APP_API_URL` set to live backend URL

---

## 👤 Role Permissions

| Feature | Admin | Member |
|---------|-------|--------|
| Create tasks | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| Update any task | ✅ | ❌ |
| Update assigned task status | ✅ | ✅ |
| Add members | ✅ | ❌ |
| Remove members | ✅ | ❌ |
| View dashboard | ✅ | ✅ |
| View tasks | ✅ | ✅ |

---

## 📸 Screenshots

### Login Page
Clean dark-themed login with JWT authentication

### Projects Dashboard
Grid view of all projects with member count

### Kanban Board
Three-column task board: To Do / In Progress / Done

### Analytics Dashboard
Real-time stats: total tasks, status breakdown, overdue tasks, tasks per user

---

## 👨‍💻 Author

**Aditya Mehta**
- GitHub: [@Adimehta10](https://github.com/Adimehta10)

---

## 📄 License

This project is built as part of a full-stack development assessment.