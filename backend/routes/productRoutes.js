import express from 'express';
import {
  createMovement,
  createProduct,
  deleteProduct,
  getProduct,
  listMovements,
  listProducts,
  movementValidation,
  productValidation,
  updateProduct
} from '../controllers/productController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();
router.use(protect);

// Movimientos - debe estar antes de /:id
router
  .route('/movements')
  .get(listMovements)
  .post(authorize('admin', 'supervisor', 'empleado'), movementValidation, validateRequest, createMovement);

// Productos
router
  .route('/')
  .get(listProducts)
  .post(authorize('admin', 'supervisor'), productValidation, validateRequest, createProduct);

// Producto individual
router
  .route('/:id')
  .get(getProduct)
  .patch(authorize('admin', 'supervisor'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

export default router;
