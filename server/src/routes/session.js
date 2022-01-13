import express from 'express';
import Auth from '../auth/authentication.js';
const router = express.Router();

router.route('/').get(Auth);

export default router;
