import express from 'express';
import { analyticsReport, lowStockReport } from '../controllers/reportController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/low-stock', authorize('admin', 'supervisor'), lowStockReport);
router.get('/analytics', authorize('admin', 'supervisor'), analyticsReport);

export default router;
