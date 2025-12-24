const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://dev-tinder-bice-three.vercel.app",
    },
  });

  io.on("connection", (socket) => {
    // Handle Events
    socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId); 
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({  firstName, lastName, userId, targetUserId, text  }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      // Save messages to the Database
      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();

      }catch(err) {
        console.log(err);
      }

      io.to(roomId).emit("messageReceived", {senderId: userId, firstName, lastName, text});
    });

    socket.on("disconnect", () => {

    });

  });
};


module.exports = initializeSocket;
