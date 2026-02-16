import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, text: true },
    descripcion: { type: String, trim: true, text: true },
    sku: { type: String, unique: true, required: true, uppercase: true, trim: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    precioCompra: { type: Number, required: true, min: 0 },
    precioVenta: { type: Number, required: true, min: 0 },
    stockActual: { type: Number, default: 0, min: 0 },
    stockMinimo: { type: Number, default: 1, min: 0 },
    ubicacion: String,
    codigoBarras: String,
    sucursal: { type: String, default: 'Principal' },
    almacen: { type: String, default: 'General' }
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: true } }
);

export const Product = mongoose.model('Product', productSchema);
