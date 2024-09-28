const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { isValidSignup } = require('./utils/validate.js');
const bcrypt = require('bcrypt');
const validator = require('validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth.js');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res, next) => {
  try {
    console.log('Test');
    isValidSignup(req.body);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

app.post('/login', async (req, res) => {
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
      res.send('Login successful');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(404).send('Error: ' + err.message);
  }
});

app.get('/user', async (req, res) => {
  const userDetails = await User.find({ emailId: 'Rohit@sharma.com' });
  try {
    res.send(userDetails);
  } catch (err) {
    res.status(404).send('User not found');
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error ' + err.message);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(404).send('No users found');
  }
});

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send('User deleted successfully');
  } catch (err) {
    res.status(500).send('Bad user request' + err);
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      'firstName',
      'lastName',
      'password',
      'age',
      'gender',
      'skills',
      'about',
    ];
    const isAllowedUpdate = Object.keys(data).every((field) =>
      ALLOWED_UPDATES.includes(field)
    );
    if (!isAllowedUpdate) {
      throw new Error(
        'Some of the fields passed are not allowed to be updated'
      );
    }
    if (data?.skills?.length > 5) {
      throw new Error('Only allowed to enter 5 skills');
    }
    const newData = await User.findOneAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    if (newData) {
      res.send('User updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send('Failed to update ' + err);
  }
});

connectDB()
  .then(() => {
    console.log('Connected to database devConnect');
    app.listen(3000, () => {
      console.log('Listening...');
    });
  })
  .catch((err) => {
    console.log(
      'Connection failed to cluster, you did something wrong Bugger!!'
    );
  });
