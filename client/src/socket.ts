import { io, Socket } from "socket.io-client";
import { User } from "./types";

const URL = "http://localhost:3000";

let socket: Socket | null = null;

export function getSocket(user: User): Socket {
  if (!socket) {
    socket = io(URL, {
      query: {
        "x-user-id": `${user.id}`,
        "x-user-name": user.username,
        "x-user-role": user.role,
      },
      transports: ["websocket"],
      path: "/socket",
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });
  }

  return socket;
}
