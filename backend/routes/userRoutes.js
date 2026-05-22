const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getMe } = require('../controllers/userController');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();
router.get('/me', protect, getMe);
router.get('/all', protect, adminOnly, getAllUsers);
module.exports = router;
