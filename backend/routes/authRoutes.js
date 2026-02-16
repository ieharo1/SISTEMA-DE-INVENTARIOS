import express from 'express';
import { login, loginValidation, logout, refreshToken, register, registerValidation } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

export default router;
