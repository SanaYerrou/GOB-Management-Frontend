import socketio from "socket.io-client";

const uri = process.env.VUE_APP_API.replace(/^https?/, "ws");

export const socketInstance = socketio(uri, {
  path: "gob_management/socket.io"
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
