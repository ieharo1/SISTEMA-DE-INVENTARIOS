import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (user) =>
  jwt.sign({ id: user._id, rol: user.rol }, env.accessSecret, { expiresIn: env.accessExpires });

export const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, env.refreshSecret, { expiresIn: env.refreshExpires });
