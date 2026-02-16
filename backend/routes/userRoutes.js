import express from 'express';
import { User } from '../models/User.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from '../controllers/crudController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect, authorize('admin'));

router.route('/').get(getAll(User, '', ['nombre', 'email'])).post(createOne(User));
router.route('/:id').get(getOne(User)).patch(updateOne(User)).delete(deleteOne(User));

export default router;
