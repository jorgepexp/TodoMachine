import express from 'express';
import UserController from '../controllers/user.js';
import { authenticateToken } from '../auth/authorization.js';
const router = express.Router();

router.route('/').get(UserController.getUsers);

// router.route('/:username').get(UserController.getUserByUsername);

// router.route('/:id').put(UserController.editUserById);
// .get(UserController.getUserById)

export default router;
