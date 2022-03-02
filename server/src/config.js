import express from 'express';
import { config } from 'dotenv';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';

const SETTINGS = config();

export default app => {
  // Desactivamos que el usuario pueda ver que la app está realizada con express
  app.disable('x-powered-by');
  //Seteamos la configuracion de variables de entorno en la aplicacion
  app.set('env', SETTINGS.parsed.ENV);
  app.set('config', SETTINGS.parsed);
  app.locals.env = app.get('env');
  app.locals.config = app.get('config');

  //Middleware para parsear json y urlencoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Manejo de cookies
  app.use(cookieParser());

  //Configuramos CORS
  const corsConfig = {
    origin: [
      'http://localhost:8080',
      'https://localhost:8080',
      'http://localhost:3000',
      'https://localhost:3000',
    ],
    credentials: true,
  };
  app.use(cors(corsConfig));

  //Configuramos el logging (registro de peticiones HTTP)
  app.use(logger('combined'));
};
