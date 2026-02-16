import express from 'express';
import { Category } from '../models/Category.js';
import { Supplier } from '../models/Supplier.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from '../controllers/crudController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.route('/categories')
  .get(getAll(Category, '', ['nombre']))
  .post(authorize('admin'), createOne(Category));

router.route('/categories/:id')
  .get(getOne(Category))
  .patch(authorize('admin'), updateOne(Category))
  .delete(authorize('admin'), deleteOne(Category));

router.route('/suppliers')
  .get(getAll(Supplier, '', ['nombre', 'contacto']))
  .post(authorize('admin'), createOne(Supplier));

router.route('/suppliers/:id')
  .get(getOne(Supplier))
  .patch(authorize('admin'), updateOne(Supplier))
  .delete(authorize('admin'), deleteOne(Supplier));

export default router;
