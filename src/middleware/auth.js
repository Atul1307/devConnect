const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error('invalid token');
    }

    const { _id } = await jwt.verify(token, 'DEV@CONNECT$0814');
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
