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
    res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) });
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
      throw new Error('user not found, try signup instead!!');
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000),
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
  res.cookie('token', null, { expires: new Date(Date.now()) });
  res.send('User logged out sucessfully');
});

module.exports = authRouter;
