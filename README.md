## 👑 Admin Credentials

```
Email: admin123@gmail.com
Password: Admin1234@#
```

⚠️ Note:

* Currently, **only one admin exists**
* Admin role is fixed
* Only the developer (owner) can change admin

---

## 👤 Sample Member Credentials

```
Email: user1@gmail.com
Password: User1234@#
```

---

## 📌 Important Notes

* You must **register first** before being added to any project
* Only registered users can be added as members
* Members will **only appear in project member list after being added by admin**
* A project can have **multiple members**
* Only admin can assign tasks
* Members cannot create projects or assign tasks
# 🚀 Team Task Manager (MERN Stack)

A full-stack **Team Task Management Web Application** built using the **MERN stack (MongoDB, Express, React, Node.js)**. This app allows teams to manage projects, assign tasks, and track progress with role-based access control.

---

## 🧩 Features

### 🔐 Authentication

* User Signup & Login (JWT based)
* Secure password hashing using bcrypt

### 👥 Roles

* **Admin**

  * Create projects
  * Add members to projects
  * Assign tasks to members
* **Member**

  * View assigned tasks
  * Update task status (Todo → In Progress → Completed)

---

## ⚙️ Project Workflow

1. User registers → becomes a **member by default**
2. Admin creates a project
3. Admin adds members (only registered users)
4. Admin assigns tasks
5. Members update task status

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Tailwind CSS
* Axios

### Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 📁 Folder Structure

```
project-root/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   └── App.jsx
```

---

## ⚡ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/yourusername/your-repo-name.git
```

### 2. Backend setup

```
cd backend
npm install
npm run dev
```

### 3. Frontend setup

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Backend (.env)

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Deployment

* Backend: Railway
* Frontend: Vercel
* Database: MongoDB Atlas

---

## 📊 Future Improvements

* Drag & Drop Kanban Board
* Notifications System
* Team Chat
* Activity Logs

---

## 💡 Conclusion

This project demonstrates:

* Role-based access control
* Full-stack integration
* Real-world task management workflow

---

🔥 Built with dedication using MERN Stack
