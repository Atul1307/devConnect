const express = require('express');
const app = express();

const adminAuth = (req, res, next) => {
  // const token = 'xyz';
  let receivedToken = 'xyz';
  let verified = receivedToken === 'xyz';
  if (!verified) {
    res.status(404).send('Unauthorised user, you bugger!!');
  } else {
    // app.send('Logged in, yayy!!!');
    next();
  }
};
const userAuth = (req, res, next) => {
  // const token = 'xyz';
  let receivedToken = 'xyz';
  let verified = receivedToken === 'xyz';
  if (!verified) {
    res.status(404).send('Unauthorised user, you bugger!!');
  } else {
    // app.send('Logged in, yayy!!!');
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
