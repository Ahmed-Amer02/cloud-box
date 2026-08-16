import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalLimiter } from './middlewares/rateLimiters.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import logger from './config/logger.js';
import folderRoutes from './features/folders/foldersRoutes.js';
import fileRoutes from './features/files/filesRoutes.js';
import uploadRoutes from './features/uploads/uploadsRoutes.js';
import tagRoutes from './features/tags/tagsRoutes.js';
import trashRoutes from './features/trash/trashRoutes.js';
import storageRoutes from './features/storage/storageRoutes.js';

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.set('trust proxy', 1);
app.use(globalLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'cloud-box' });
});

app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/trash', trashRoutes);
app.use('/api/storage', storageRoutes);

app.use((err, req, res, next) => {
  logger.error({ err }, 'An error occurred');
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
