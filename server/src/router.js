import board from './routes/board.js';
import user from './routes/user.js';
import auth from './routes/auth.js';
import { verifyJWT } from './middlewares/verifyJWT.js';

export default app => {
  app.use('/user', user);
  app.use('/auth', auth);

  // A partir de aquí todas las rutas requieren autorización con Bearer Token
  app.use(verifyJWT);
  app.use('/boards', board);

  // Si no usan ninguna de nuestra rutas, redirigimos con un 404
  app.use('*', (req, res) => res.status(404).json({ error: 'Page not found' }));
};
