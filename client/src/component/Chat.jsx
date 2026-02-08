import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socketRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      const chatMessages = chat?.data?.messages.map((msg) => {
        return {
          senderId: msg?.senderId._id,
          firstName: msg?.senderId?.firstName,
          lastName: msg?.senderId?.lastName,
          text: msg?.text,
        };
      });

      setMessages(chatMessages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchChatMessages();
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !user) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      userId,
      targetUserId,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    socketRef.current.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const sendMessage = () => {
    if (!socketRef.current) {
      console.log("Socket not connected yet");
      return;
    }

    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div
      className="
    w-full sm:w-[90%] md:w-2/3 lg:w-1/2
    mx-auto
    border border-gray-600
    my-3
    h-[85vh] sm:h-[75vh]
    flex flex-col
    rounded-xl
    overflow-hidden"
    >
      <h1 className="p-3 sm:p-5 border-b border-gray-600 text-center font-semibold">
        Chat
      </h1>

      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              "chat " + (msg.senderId === userId ? "chat-end" : "chat-start")
            }
          >
            <div className="chat-header text-xs sm:text-sm">
              {msg.firstName} {msg.lastName}
            </div>
            <div className="chat-bubble max-w-[85%]">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="p-2 sm:p-4 border-t border-gray-600 flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 p-2 rounded text-white"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary btn-sm sm:btn-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
