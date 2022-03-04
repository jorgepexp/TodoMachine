import express from 'express';
import UserController from '../controllers/user.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
const router = express.Router();

router.route('/register').post(UserController.addUser);
router.route('/login').post(UserController.handleLogin);
router.route('/logout').get(UserController.handleLogout);

router
  .route('/')
  .patch(UserController.patchUser)
  .get(verifyJWT, UserController.getUsers);

export default router;
