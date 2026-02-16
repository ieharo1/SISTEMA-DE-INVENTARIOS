import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/inventory_enterprise',
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};
