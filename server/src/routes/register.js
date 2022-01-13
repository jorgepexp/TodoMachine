import express from 'express';
import UserController from '../controllers/user.js';
const router = express.Router();

router.route('/').post(UserController.addUser);

export default router;
