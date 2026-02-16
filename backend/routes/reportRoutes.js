import express from 'express';
import { analyticsReport, lowStockReport, inventoryReport, movementsReport, valorReport } from '../controllers/reportController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/low-stock', authorize('admin', 'supervisor'), lowStockReport);
router.get('/analytics', authorize('admin', 'supervisor'), analyticsReport);
router.get('/inventario', authorize('admin', 'supervisor'), inventoryReport);
router.get('/movimientos', authorize('admin', 'supervisor'), movementsReport);
router.get('/valor', authorize('admin', 'supervisor'), valorReport);
router.get('/bajo-stock', authorize('admin', 'supervisor'), lowStockReport);

export default router;
