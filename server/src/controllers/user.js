import usersDAO from '../dao/usersDAO.js';
import { generateAccessToken, generateRefreshToken } from './auth.js';
import bcrypt from 'bcrypt';

class UserController {
  async getUsers(req, res) {
    const usersPerPage = req.query.usersPerPage
      ? parseInt(req.query.usersPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    let filters = {};
    if (req.query.username) filters.username = req.query.username;
    else if (req.query.id) filters.id = req.query.id;
    else if (req.query.name) filters.name = req.query.name;
    else if (req.query.refreshToken)
      filters.refreshToken = req.query.refreshToken;

    let users = await usersDAO.getUsers({ filters, page, usersPerPage });
    //* Retiramos la contraseña de la respuesta
    users ?? [...users, (users[0].password = '')];

    let response = {
      users,
      page,
      filters,
      entries_per_page: usersPerPage,
    };

    return res.status(200).json(response);
  }

  // Método de registro de usuario
  async addUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          message: 'Bad request',
          error: true,
        });
      }
      const hashedPassword = await bcrypt.hash(password, parseInt(11));

      const result = await usersDAO.addUser(username, hashedPassword);
      if (result.insertedCount === 0) {
        return res.status(400).json({
          message: 'El nombre de usuario ya está siendo utilizado',
          error: true,
        });
      }

      const response = {
        id: result.insertedId,
      };

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).send(`Algo ha ido mal: ${error.message}`);
    }
  }

  async handleLogin(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.sendStatus(400);

      const filters = { username };
      const user = await usersDAO.getUsers({ filters });

      if (!user.length) return res.sendStatus(401);

      if (!(await bcrypt.compare(password, user[0].password)))
        return res.sendStatus(401);

      const accessToken = generateAccessToken({ username: user[0].username });
      const refreshToken = generateRefreshToken({ username: user[0].username });

      // * Introducimos el nuevo token en BD
      const filtros = { username };
      const document = { refreshToken };
      await usersDAO.patchUser(filtros, document);

      // maxAge: 30 * 1000, // 30s seconds
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: process.env.NODE_ENV !== 'development' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV !== 'development',
      });
      res.status(200).json({ accessToken, id: user[0]._id });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  async handleLogout(req, res) {
    //? Remember to delete accessToken in the client
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;

    //* Buscamos el token en BD
    const filters = { filters: { refreshToken } };
    const result = await usersDAO.getUsers(filters);
    const foundUserToken = result[0]?.refreshToken;

    //* Eliminamos el token si se encuentra en la BD
    if (foundUserToken === refreshToken) {
      const document = { refreshToken: '' };
      await usersDAO.patchUser({ refreshToken }, document);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV !== 'development',
      });
      return res.sendStatus(204);
    }

    //* Si no se encuentra, simplemente eliminamos la cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV !== 'development',
    });
    return res.sendStatus(204);
  }

  async patchUser(req, res) {
    const { filters, document } = req.body;
    if (!filters || !document) return res.sendStatus(400);

    let modifiedCount = await usersDAO.patchUser(filters, document);

    if (modifiedCount === 0) return res.sendStatus(400);

    return res.sendStatus(200);
  }
}

export default new UserController();
