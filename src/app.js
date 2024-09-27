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
