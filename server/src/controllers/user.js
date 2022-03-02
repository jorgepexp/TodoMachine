import usersDAO from '../dao/usersDAO.js';
import { generateAccessToken, generateRefreshToken } from './auth.js';
import bcrypt from 'bcrypt';
// import dayjs from 'dayjs';

class UserController {
  async getUsers(req, res) {
    // Comprobamos los parámetros que nos han pasado en la llamada a la API
    const usersPerPage = req.query.usersPerPage
      ? parseInt(req.query.usersPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.username) filters.username = req.query.username;
    else if (req.query.id) filters.id = req.query.id;
    else if (req.query.email) filters.email = req.query.email;
    else if (req.query.name) filters.name = req.query.name;

    let users = await usersDAO.getUsers({ filters, page, usersPerPage });
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

      let hashedPassword = await bcrypt.hash(password, parseInt(11));

      let result = await usersDAO.addUser(username, hashedPassword);
      if (result.insertedCount === 0) {
        return res.status(403).json({
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
      if (!username || !password) {
        return res.status(400).json({
          message: 'Bad request',
        });
      }

      let filters = {};
      filters.username = username;
      const user = await usersDAO.getUsers({ filters });

      if (!user.length) return res.sendStatus(401);

      if (!(await bcrypt.compare(password, user[0].password)))
        return res.sendStatus(401);

      const accessToken = generateAccessToken(user[0].username);
      const refreshToken = generateRefreshToken(user[0].username);

      // TODO Insertar este nuevo usuario junto al token de refresco en la BDD
      // const currentUser = { ...user, refreshToken };

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV !== 'development',
      });

      res.json({ accessToken });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  async handleLogout(req, res) {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;

    // TODO Si refreshToken no está en BD, eliminamos la cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV !== 'development',
    });
    // TODO Si lo está, lo eliminamos de la BD
    return res.sendStatus(204);
  }
}

export default new UserController();
