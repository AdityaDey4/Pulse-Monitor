import http from "http";

import { initializeSocket } from "./socket";

const server = http.createServer();

async function bootstrap() {
  await initializeSocket(server);

  const port = Number(
    process.env.SOCKET_PORT ?? 3001
  );

  server.listen(port, () => {
    console.log(
      `Socket server running on ${port}`
    );
  });
}

bootstrap();