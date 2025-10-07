const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema({
  
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // refrence to the user collection
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: '{VALUE} is incorrect status type'
    },
  }
},
  {
    timestamps: true
  }
);

connectionRequest.index({ fromUserId: 1, toUserId: 1 });

connectionRequest.pre("save", function (next) {
  const connectionReq = this;

  if(connectionReq.fromUserId.equals(connectionReq.toUserId)) {
    throw new Error("Cannot send connection request to yourself!!");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequest);