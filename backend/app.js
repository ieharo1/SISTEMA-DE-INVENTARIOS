import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { env } from './config/env.js';
import { swaggerSpec } from './docs/swagger.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

export default app;
