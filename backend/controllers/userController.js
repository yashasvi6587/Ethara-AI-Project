const User = require('../models/User');

exports.getMe = async (req, res, next) => {
    try {
        const user = req.user.toObject();
        delete user.password;
        res.json(user);
    } catch (error) {
        next(error);
    }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (error) {
    next(error);
  }
};