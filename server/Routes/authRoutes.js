// authRoutes.js
import express from 'express';
import { login } from '../Controllers/authController.js';

const router = express.Router();

// POST: Login route
router.post('/login', login);

export default router;
