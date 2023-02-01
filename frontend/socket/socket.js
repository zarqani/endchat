import io from "socket.io-client";
import { parseCookies } from "nookies";
import { onSentMessage } from "./chat";
import { SOCKET_ENDPOINT } from ".env.js";

const endpoint = SOCKET_ENDPOINT;
let socket = null;

const onConnected = () => {
  console.log("socket: connected");
};

const onDisconnect = () => {
  console.log("socket: disconnect");
};

export const configSocket = (token) => {
  console.log(socket, "socket1");
  if (socket && socket.disconnected) {
    socket.connect();
  }

  if (socket) return;

  socket = io.connect(endpoint, {
    path: "/chat/socket.io",
    query: `token=${token}`,
  });

  // socket.connect();

  console.log(socket.connected, "socket.connected");

  socket.on("connect", onConnected);
  socket.on("disconnect", onDisconnect);
  socket.on("res-sent-message", onSentMessage);

  // return socket;
};

export const socketDisconnect = () => {
  socket.disconnect();
};

export const getSocket = () => {
  console.log(socket, "getSocket");

  return socket;
};

console.log(socket, "socket");
