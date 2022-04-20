import express from 'express';
import { handleRefreshToken } from '../controllers/auth.js';
const router = express.Router();

router.route('/refresh').get(handleRefreshToken);
// router.route('/auth').get();

export default router;
