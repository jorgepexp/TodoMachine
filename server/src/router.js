import board from './routes/board.js';
import register from './routes/register.js';
import user from './routes/user.js';
import login from './routes/login.js';
import logout from './routes/logout.js';
import session from './routes/session.js';
// import { authenticateToken } from './auth/authorization.js';

export default app => {
  app.use('/boards', board);
  // app.use('/user', authenticateToken, user);
  app.use('/user', user);
  app.use('/register', register);
  app.use('/login', login);
  app.use('/logout', logout);
  app.use('/checkLogin', session);

  // Si no usan ninguna de nuestra rutas, redirigimos con un 404
  app.use('*', (req, res) => res.status(404).json({ error: 'Page not found' }));
};
