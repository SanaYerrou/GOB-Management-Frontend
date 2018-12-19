import socketio from "socket.io-client";

const uri = process.env.VUE_APP_API;

export const socketInstance = socketio(uri, {
  path: "/gob_management/socket.io",
  transports: ["websocket", "polling"]
});

export function connect() {
  socketInstance.connect();
}

export function disconnect() {
  socketInstance.disconnect();
}

export function subscribe(event, cb) {
  console.log("SUBSCRIBE: ", event);
  socketInstance.on(event, data => cb(data));
}

[
  "connect",
  "disconnect",
  "connect_error",
  "connect_timeout",
  "reconnect",
  "reconnect_error"
].map(e => {
  subscribe(e, () => console.log("WS EVENT: " + e));
});
