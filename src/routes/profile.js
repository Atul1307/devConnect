const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middleware/auth.js');
const validator = require('validator');
const bcrypt = require('bcrypt');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error ' + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      'firstName',
      'lastName',
      'age',
      'gender',
      'skills',
      'about',
      'photoUrl',
    ];
    const isAllowedUpdate = Object.keys(req.body).every((field) =>
      ALLOWED_UPDATES.includes(field)
    );
    if (!isAllowedUpdate) {
      throw new Error(
        'Some of the fields passed are not allowed to be updated'
      );
    }
    if (req.body?.skills?.length > 5) {
      throw new Error('Only allowed to enter 5 skills');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: 'Profile updated sucessfully',
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send('Failed to update ' + err);
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error('Please enter a strong password!');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = passwordHash));
    res.json({
      message: 'Password updated successfully',
      data: passwordHash,
    });
    loggedInUser.save();
  } catch (err) {
    res.status(400).send('Error ' + err.message);
  }
});

module.exports = profileRouter;
