import { logger } from '../utils/logger.js';

export const notFound = (req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
};

export const errorHandler = (err, _req, res, _next) => {
  logger.error(err.message, { stack: err.stack, statusCode: err.statusCode });
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'Error interno del servidor' });
};
