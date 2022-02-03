'use strict';
import express from 'express';
import config from './config.js';
import router from './router.js';
import dbConnection from './connection.js';
import usersDAO from './dao/usersDAO.js';
import boardsDAO from './dao/boardsDAO.js';

let _server;
const app = express();

const server = {
  async start() {
    config(app);
    const port = app.locals.config.PORT;
    const host = app.locals.config.HOST;

    router(app);

    //Conectamos con la base de datos mongodb alojada en el cloud MongoDBAtlas
    let conn = await dbConnection();

    _server = app.listen(port, error => {
      if (error) {
        console.log('Problema al iniciar al servidor', error);
        return;
      }
      console.log(`Servidor abierto en http://${host}:${port}`);
      usersDAO.injectDB(conn);
      boardsDAO.injectDB(conn);
    });

    return server;
  },
  close() {
    _server.close();
  },
};

server.start();

export default server;

// En caso de excepción sin controlar, mostramos un mensaje en el servidor
process.on('unhandledRejection', (err, p) => {
  console.log('Custom Error: An unhandled rejection ocurred');
  console.log(`Custom Error: Rejection ${err}`);
});
