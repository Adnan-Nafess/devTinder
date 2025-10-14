const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status type: ${status}` });
    }

    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ message: "You cannot send a request to yourself!" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: `You already ${existingConnectionRequest.status} this user!`,
      });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.status(200).json({
      message: `${req.user.firstName} ${req.user.lastName} is ${status} in to ${toUser.firstName} ${toUser.lastName}`,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
});



requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params; 

    const allowedStatus = ["accepted", "rejected"];
    
    if(!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed!!"});
    }

    const connectionReq = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if(!connectionReq) {
      return res.status(404).json({ message: "Connection request not found!!" });
    }

    connectionReq.status = status;

    const data = await connectionReq.save();

    res.json({ message: "Connection request " + status, data });

  }catch(err) {
    res.status(400).send("Error: " + err.message);
  }
});


module.exports = requestRouter;