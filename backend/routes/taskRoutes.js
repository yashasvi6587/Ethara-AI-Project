const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.route('/')
    .post(
        protect,
        adminOnly,
        [
            body('title').notEmpty().withMessage('Title is required'),
            body('projectId').notEmpty().withMessage('Project ID is required'),
            body('assignedTo').notEmpty().withMessage('Assigned user is required'),
        ],
        createTask
    )
    .get(protect, getTasks);

router.route('/:id')
    .put(
        protect,
        [
            body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
        ],
        updateTask
    )
    .delete(protect, adminOnly, deleteTask);

module.exports = router;
