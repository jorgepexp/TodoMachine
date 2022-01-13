import usersDAO from '../dao/usersDAO.js';
import { generateAccessToken } from '../auth/authorization.js';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

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

  async addUser(req, res) {
    try {
      let userData = {};
      // Conseguimos el usuario y la contraseña de la petición
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(403).json({
          error: 'Datos incompletos',
        });
      }

      // Encriptamos la contraseña
      let hashedPassword = await bcrypt.hash(password, 10);
      userData.username = username;
      userData.password = hashedPassword;

      // TODO No enviar la contraseña de vuelta
      let user = await usersDAO.addUser(userData);
      if (!user.length) {
        return res.status(403).json({
          error: 'El nombre de usuario ya está siendo utilizado',
        });
      }
      const token = generateAccessToken(username);
      let response = {
        user,
        token,
      };

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).send(`Algo ha ido mal: ${error.message}`);
    }
  }

  async login(req, res) {
    try {
      let filters = {};
      // TODO Poder hacer login también con el email
      const { username, password } = req.body;

      if (!username || !password)
        throw new Error('username o password undefined');

      filters.username = username;

      const user = await usersDAO.getUsers({ filters });
      if (!user.length) {
        return res
          .status(403)
          .send({ message: 'Información de login incorrecta' });
      }

      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
        return res
          .status(403)
          .send({ message: 'Información de login incorrecta' });
      }

      req.session.authenticated = true;
      req.session.username = username;
      const token = generateAccessToken(username);

      // res.cookie('access_token', JSON.stringify(token), {
      // 	secure: process.env.NODE_ENV !== 'development',
      // 	httpOnly: true,
      // 	sameSite: true,
      // 	expires: dayjs().add(30, 'days').toDate(),
      // });

      return res.status(200).json({
        username,
        id: user[0]._id,
        token,
        error: null,
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  async logout(req, res) {
    //Expiramos el JWT y destruimos las sesiones activas
    // res.cookie('access_token', {
    // 	expires: new Date('01-01-1970').toISOString(),
    // });
    // res.clearCookie('access_token');
    req.session.destroy();
    return res.status(200).send('Logout correcto');
  }

  // editUserById(req, res) {
  // 	return res.status(200).json({ key: `put ${req.params.id}` });
  // }
}

export default new UserController();
