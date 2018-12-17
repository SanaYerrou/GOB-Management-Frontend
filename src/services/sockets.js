import socketio from "socket.io-client";

export const socketInstance = socketio("ws://127.0.0.1:8143", {
  path: "/gob_management/socket.io"
});

export function connect() {
  socketInstance.connect();
}

export function disconnect() {
  socketInstance.disconnect();
}

export function subscribe(event, cb) {
  socketInstance.on(event, data => cb(data));
}

socketInstance.on("connect", () => console.log("CONNECTED"));
socketInstance.on("disconnect", () => console.log("DISCONNECTED"));
