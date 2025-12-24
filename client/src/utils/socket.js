import { io } from "socket.io-client";
import { BASE_URL } from "./constant";

export const createSocketConnection = () => {
  return io(BASE_URL, {
    transports: ["websocket"],   // ✅ force WebSocket
    withCredentials: true,       // ✅ cookies/session support
    autoConnect: true,
  });
};
