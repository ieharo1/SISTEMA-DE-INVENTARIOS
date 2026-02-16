import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);
