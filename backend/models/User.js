import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contraseña: { type: String, required: true, minlength: 8, select: false },
    rol: { type: String, enum: ['admin', 'supervisor', 'empleado'], default: 'empleado' },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
    refreshToken: { type: String, select: false }
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: true } }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 12);
  next();
});

userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.contraseña);
};

export const User = mongoose.model('User', userSchema);
