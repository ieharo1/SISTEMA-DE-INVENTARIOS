import { body } from 'express-validator';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { signAccessToken, signRefreshToken } from '../services/tokenService.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const registerValidation = [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('contraseña').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('contraseña').notEmpty().withMessage('Contraseña requerida')
];

const buildAuthResponse = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await User.findByIdAndUpdate(user._id, { refreshToken });
  return { accessToken, refreshToken };
};

export const register = catchAsync(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw new AppError('Email ya registrado', 400);
  const user = await User.create(req.body);
  const tokens = await buildAuthResponse(user);
  res.status(201).json({ user, ...tokens });
});

export const login = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+contraseña');
  if (!user || !(await user.comparePassword(req.body.contraseña))) throw new AppError('Credenciales inválidas', 401);
  if (user.estado !== 'activo') throw new AppError('Usuario inactivo', 401);
  const tokens = await buildAuthResponse(user);
  res.json({ user: { _id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }, ...tokens });
});

export const refreshToken = catchAsync(async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) throw new AppError('Refresh token requerido', 401);

  const payload = jwt.verify(token, env.refreshSecret);
  const user = await User.findById(payload.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new AppError('Refresh token inválido', 401);

  const accessToken = signAccessToken(user);
  res.json({ accessToken });
});

export const logout = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.json({ message: 'Sesión cerrada de forma segura' });
});
