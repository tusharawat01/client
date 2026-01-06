import { io } from "socket.io-client";
export const server = process.env.NEXT_PUBLIC_HOST;

// const server = "https://a2a-server.vercel.app";
export const socket = io(server, {
  withCredentials: true,
  // extraHeaders: {
  //   "Access-Control-Allow-Origin": "http://localhost:3000",
  //   "my-custom-header": "abcd",
  // },
});
