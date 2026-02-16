import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

const seed = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@empresa.com';
  const exists = await User.findOne({ email });
  if (!exists) {
    await User.create({
      nombre: process.env.ADMIN_NAME || 'System Admin',
      email,
      contraseña: process.env.ADMIN_PASSWORD || 'Admin123!',
      rol: 'admin'
    });
    console.log('Admin creado');
  } else {
    console.log('Admin ya existe');
  }
  process.exit(0);
};

seed();
