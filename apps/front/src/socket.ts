import { Socket, io } from "socket.io-client";

import { ClientToServerEvents, ServerToClientEvents } from "../../back/src/events/events.gateway";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("ws://localhost:4001");

export default socket;
