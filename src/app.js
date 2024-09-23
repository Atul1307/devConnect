const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res, next) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(400).send('Error saving the user you bugger!!' + err.message);
  }
});

app.get('/user', async (req, res) => {
  const userDetails = await User.find({ emailId: 'sRohit@sharma.com' });
  try {
    res.send(userDetails);
  } catch (err) {
    res.status(404).send('User not found');
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

app.patch('/user', async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;
  console.log(emailId, data);
  try {
    const newData = await User.findOneAndUpdate({ emailId: emailId }, data);
    if (newData) {
      res.send('User updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send('Failed to update');
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
