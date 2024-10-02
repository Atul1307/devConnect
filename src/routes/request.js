const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');
const { userAuth } = require('../middleware/auth');

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionUser = await user.findById(toUserId);
      if (!connectionUser) {
        return res.status(400).json({
          message: 'The user you are trying to connect with does not exist',
        });
      }

      const ifConnectionExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (ifConnectionExists) {
        return res.status(400).json({
          message:
            'You have already send a connection request to this user, try another one instead!!',
        });
      }

      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid status type:' + status });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          loggedInUser.firstName +
          ' ' +
          loggedInUser.lastName +
          ` ${
            status === 'interested' ? 'sent' : 'ignored'
          } a connection request to ` +
          connectionUser.firstName +
          ' ' +
          connectionUser.lastName,
        data,
      });
    } catch (err) {
      res.status(400).send('Error: ' + err.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      // Validate status
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Wrong status' });
      }

      // Validate the requester's ID
      // const isAllowedUser = await user.findById(requestId);
      // if (!isAllowedUser) {
      //   return res.status(400).json({ message: 'User not present' });
      // }

      // Validate if connection is present
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'Connection request not found' });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: 'Connection request ' + status, data });
    } catch (err) {
      res.status(400).send('Error: ' + err.message);
    }
  }
);

module.exports = requestRouter;
