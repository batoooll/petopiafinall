import type { Server } from "socket.io";

/** Lets REST handlers broadcast on the same Socket.IO instance (avoids import cycle with chat.socket). */
let ioRef: Server | null = null;

export const setChatIo = (io: Server): void => {
  ioRef = io;
};

export const getChatIo = (): Server | null => ioRef;
