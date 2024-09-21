const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signup', async (req, res, next) => {
  const user = new User({
    firstName: 'Atul',
    lastName: 'Sharma',
    email: 'Atul@sharma.com',
    password: 'Atul@123',
  });
  try {
    await user.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(400).send('Error saving the user you bugger!!' + err.message);
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
