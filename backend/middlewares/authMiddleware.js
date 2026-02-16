import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const protect = async (req, _res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

  if (!token) return next(new AppError('No autorizado', 401));

  try {
    const decoded = jwt.verify(token, env.accessSecret);
    const user = await User.findById(decoded.id);
    if (!user || user.estado !== 'activo') return next(new AppError('Usuario inválido', 401));
    req.user = user;
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return next(new AppError('No tiene permisos para este recurso', 403));
  }
  next();
};
