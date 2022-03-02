import jwt from 'jsonwebtoken';

export const handleRefreshToken = (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;

    //TODO Comprobar cookie almacenada en BDD contra la recibida
    // const userMatches =
    // if (!userMatches) return res.sendStatus(403);

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
