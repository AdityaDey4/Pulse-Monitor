import { Server } from "socket.io";
import { startSubscriber } from "./subscriber";

let io: Server | null = null;
let subscriberStarted = false;

export async function initializeSocket(
  server: any
) {

  if (io) {
    return io;
  }

  
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
  });

  if (!subscriberStarted) {
    subscriberStarted = true;

    await startSubscriber();
  }

  io.on("connection", (socket) => {

  socket.on(
    "join-user-room",
    (userId: string) => {

      socket.join(
        `user:${userId}`
      );

    }
  );

  socket.on(
      "join-monitor-room",
      (monitorId: string) => {
        socket.join(
          `monitor:${monitorId}`
        );
      }
    );

    socket.on(
      "leave-monitor-room",
      (monitorId: string) => {
        socket.leave(
          `monitor:${monitorId}`
        );
      }
    );

});

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error(
      "Socket not initialized"
    );
  }

  return io;
}