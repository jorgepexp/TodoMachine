import express from 'express';
import UserController from '../controllers/user.js';
const router = express.Router();

router.route('/').get(UserController.logout);

export default router;
