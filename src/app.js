const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.patch('/test-cors', (req, res) => {
  res.json({ message: 'CORS test successful!' });
});

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

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
