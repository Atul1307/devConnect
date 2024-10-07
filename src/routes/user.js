const express = require('express');
const { userAuth } = require('../middleware/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';
const Users = require('../models/user');

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);
    res.json({ message: 'Data fetched sucessfully', data: connectionRequests });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 50;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((user) => {
      hideUsersFromFeed.add(user.toUserId);
      hideUsersFromFeed.add(user.fromUserId);
    });
    const feedUsers = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({
      message: 'These are your feed results',
      data: feedUsers,
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = userRouter;
