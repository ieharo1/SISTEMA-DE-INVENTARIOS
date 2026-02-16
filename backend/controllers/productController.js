import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Product } from '../models/Product.js';
import { InventoryMovement } from '../models/InventoryMovement.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { getAll, getOne, updateOne, deleteOne } from './crudController.js';

export const productValidation = [
  body('nombre').notEmpty(),
  body('sku').notEmpty(),
  body('categoria').notEmpty(),
  body('proveedor').notEmpty(),
  body('precioCompra').isFloat({ min: 0 }),
  body('precioVenta').isFloat({ min: 0 })
];

export const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const listProducts = getAll(Product, 'categoria proveedor', ['nombre', 'descripcion', 'sku']);
export const getProduct = getOne(Product, 'categoria proveedor');
export const updateProduct = updateOne(Product);
export const deleteProduct = deleteOne(Product);

export const movementValidation = [
  body('tipo').isIn(['entrada', 'salida', 'ajuste']),
  body('producto').notEmpty(),
  body('cantidad').isInt({ min: 1 })
];

export const createMovement = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tipo, producto, cantidad } = req.body;
    const product = await Product.findById(producto).session(session);
    if (!product) throw new AppError('Producto no existe', 404);

    if (tipo === 'salida' && product.stockActual < cantidad) {
      throw new AppError('Stock insuficiente', 400);
    }

    if (tipo === 'entrada') product.stockActual += cantidad;
    if (tipo === 'salida') product.stockActual -= cantidad;
    if (tipo === 'ajuste') product.stockActual = cantidad;

    await product.save({ session });
    const movement = await InventoryMovement.create([{ ...req.body, usuario: req.user._id }], { session });

    await session.commitTransaction();
    res.status(201).json(movement[0]);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const listMovements = getAll(InventoryMovement, 'producto usuario', ['motivo', 'referencia']);
