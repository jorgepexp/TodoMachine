import jwt from 'jsonwebtoken';
import usersDAO from '../dao/usersDAO.js';

export const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    const filters = { filters: { refreshToken } };
    console.log('Encuentra el token en las cookies');
    const foundUser = await usersDAO.getUsers(filters);

    //* Si no se encuentra el token en BD lanzamos Forbidden
    if (foundUser?.length > 1) return res.sendStatus(403);

    //* Evalua el JWT
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_SECRET,
        { expiresIn: '5m' }
      );
      return res.json({ accessToken });
    });
  } catch (error) {
    return res
      .status(403)
      .send({ message: `Autentificación fallida 🚨 ${error.message}` });
  }
};

export const generateAccessToken = function ({ username }) {
  return jwt.sign({ username }, process.env.ACCESS_SECRET, {
    expiresIn: '5m',
  });
};

export const generateRefreshToken = function ({ username }) {
  return jwt.sign({ username }, process.env.REFRESH_SECRET, {
    expiresIn: '7d',
  });
};
