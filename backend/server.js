import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => logger.info(`Servidor backend en puerto ${env.port}`));
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

start();
