import io from "socket.io-client";
var socket = io.connect(process.env.REACT_APP_SOCKET_URL);

export default socket;
