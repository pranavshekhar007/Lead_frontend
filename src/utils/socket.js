// utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:7007/api", {
  transports: ["websocket"],
});

export default socket;