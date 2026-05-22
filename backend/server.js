const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
// const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ethara-ai-project-5rf4.vercel.app'
  ],
  credentials: true
}));

app.get('/', (req, res) => res.json({ message: 'Team Task Manager API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
