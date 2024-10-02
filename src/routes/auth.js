const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const authRouter = express.Router();
const User = require('../models/user');
const { isValidSignup } = require('../utils/validate.js');

authRouter.post('/signup', async (req, res, next) => {
  try {
    isValidSignup(req.body);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    console.log('Generated Token for signup:', token); // Add this line in both login and signup routes
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure it is true when in production
      sameSite: 'Strict', // Adjust based on your needs
      expires: new Date(Date.now() + 8 * 3600000), // Cookie expiration
    });
    res.json({ message: 'User created successfully', data: savedUser });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const isEmailValid = validator.isEmail(emailId);
    if (!isEmailValid) {
      throw new Error('Invalid credentials');
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('User not found, try signup instead!!');
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log('Generated Token for login:', token); // Add this line in both login and signup routes
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure it is true when in production
        sameSite: 'None', // Adjust based on your needs
        expires: new Date(Date.now() + 8 * 3600000), // Cookie expiration
      });
      res.send(user);
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(404).send('Error: ' + err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    expires: new Date(0), // Expire the cookie immediately
  });
  res.send('User logged out successfully');
});

module.exports = authRouter;
