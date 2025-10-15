const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Get all the pending connection request for the loggedIn User
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender about skills photoUrl");

    res.json({
      message: "Data fetched successfully",
      data: connectionRequest,
    })

  }catch(err) {
    res.status(400).send("Error: " + err.message);
  }
});


userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    })
    .populate("fromUserId", "firstName lastName age gender about skills photoUrl")
    .populate("toUserId", "firstName lastName age gender about skills photoUrl");

    const data = connectionRequest.map((row) => {
      return row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId;
    });

    res.json({
      message: "Connections found successfully",
      data,
    });

  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});


userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId")

    const hiddenUsersFromFeed = new Set();

    connectionRequest.forEach(req => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) }},
        { _id: { $ne: loggedInUser._id }},
      ], 
    }).select("firstName lastName age gender about skills photoUrl").skip(skip).limit(limit);

    res.send(users);

  }catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
