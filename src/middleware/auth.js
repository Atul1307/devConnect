const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const userAuth = async (req, res, next) => {
  try {
    console.log('Received cookies:', req.cookies);
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send('Please login!');
    }

    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(_id);

    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send('Error ' + err.message);
  }
};

module.exports = {
  userAuth,
};
