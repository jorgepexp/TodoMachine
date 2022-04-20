import jwt from 'jsonwebtoken';
import usersDAO from '../dao/usersDAO.js';

export const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    const filters = { filters: { refreshToken } };

    const foundUser = await usersDAO.getUsers(filters);
    //* Si no se encuentra el token en BD lanzamos Forbidden
    if (foundUser?.length > 1) return res.sendStatus(403);
    console.log(foundUser[0].username);
    console.log(foundUser[0].refreshToken);

    //* Evalua el JWT
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err || foundUser[0].username !== decoded.username)
        // Devolvemos un status code único para facilitar en friendly login desde el cliente
        return res.sendStatus(406);

      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_SECRET,
        {
          expiresIn: '5m',
        }
      );
      return res.status(200).json({ accessToken });
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
    expiresIn: '1d',
  });
};
