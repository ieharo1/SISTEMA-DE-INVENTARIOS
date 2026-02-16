import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    contacto: String,
    telefono: String,
    email: { type: String, lowercase: true, trim: true },
    direccion: String
  },
  { timestamps: true }
);

export const Supplier = mongoose.model('Supplier', supplierSchema);
