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

router
  .route('/')
  .get(listProducts)
  .post(authorize('admin', 'supervisor'), productValidation, validateRequest, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .patch(authorize('admin', 'supervisor'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

router
  .route('/movements')
  .get(listMovements)
  .post(authorize('admin', 'supervisor', 'empleado'), movementValidation, validateRequest, createMovement);

export default router;
