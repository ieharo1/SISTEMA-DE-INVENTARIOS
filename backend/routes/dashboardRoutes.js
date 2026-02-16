import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getDashboard);

export default router;
