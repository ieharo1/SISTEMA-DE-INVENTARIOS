import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    accion: { type: String, required: true },
    detalles: mongoose.Schema.Types.Mixed,
    ip: String
  },
  { timestamps: { createdAt: 'fecha', updatedAt: false } }
);

export const AuditLog = mongoose.model('AuditLog', auditSchema);
