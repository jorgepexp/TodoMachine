import jwt from 'jsonwebtoken';

export const generateAccessToken = function ({ username }) {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

export const authenticateToken = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ error: 'No authentification headers 🛑 ' });
  }

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).send({ error: 'Autentificación fallida 🚨 ' });

    req.user = user;
    console.log('Token verificado ✔️ ', user);
    next();
  });
};
