import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema(
  {
    tipo: { type: String, enum: ['entrada', 'salida', 'ajuste'], required: true },
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    cantidad: { type: Number, required: true, min: 1 },
    motivo: String,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referencia: String,
    sucursal: { type: String, default: 'Principal' },
    almacen: { type: String, default: 'General' }
  },
  { timestamps: { createdAt: 'fecha', updatedAt: true } }
);

export const InventoryMovement = mongoose.model('InventoryMovement', movementSchema);
