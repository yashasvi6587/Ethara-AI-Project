const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
} = require('../controllers/projectController');

const router = express.Router();

router.route('/')
    .post(protect, adminOnly, [body('name').notEmpty().withMessage('Project name is required')], createProject)
    .get(protect, getProjects);

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, adminOnly, [body('name').notEmpty().withMessage('Project name is required')], updateProject)
    .delete(protect, adminOnly, deleteProject);

router.post('/:id/add-member', protect, adminOnly, [body('email').isEmail().withMessage('Valid email is required')], addMember);

module.exports = router;
