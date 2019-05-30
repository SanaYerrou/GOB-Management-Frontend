import socketio from "socket.io-client";

import { get_api } from "./api";

const uri = get_api();

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

["connect", "disconnect", "connect_error", "connect_timeout", "reconnect_error"].map(e => {
  subscribe(e, () => console.log("WS EVENT: " + e));
});
