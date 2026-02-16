import { AuditLog } from '../models/AuditLog.js';

export const audit = (accionResolver) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode >= 400) return;
    const accion = typeof accionResolver === 'function' ? accionResolver(req) : accionResolver;
    if (!accion) return;
    try {
      await AuditLog.create({
        usuario: req.user?._id,
        accion,
        detalles: { method: req.method, path: req.originalUrl, body: req.body },
        ip: req.ip
      });
    } catch {
      // ignore audit errors
    }
  });
  next();
};
