// Middleware para comprobar si el usuario ha iniciado sesión
export default function checkLogin(req, res) {
  if (req.session.authenticated) {
    res.status(200).send({ username: req.session.username });
  } else {
    res.status(204);
  }
}
