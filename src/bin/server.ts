import { Server } from 'http';
import { Express } from 'express';

const DEFAULT_PORT = '5000';
let server: Server;
const startServer = (app: Express) => {
  const PORT = process.env.SRV_PORT || DEFAULT_PORT;

  server = app.listen(PORT, () => {
    console.log(`Server is running... Listening on ${PORT}`);
  });
};

// Permite o encerramento não abrupto do servidor ao receber o comando
// de encerramento do shell tentando responder às requisições correntes
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated by SIGTERM');
  });
});

export default startServer;
