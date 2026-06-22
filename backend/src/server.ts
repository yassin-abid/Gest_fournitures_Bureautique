import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middleware/errorHandler';

// Routers
import authRouter from './modules/auth/auth.router';
import catalogRouter from './modules/catalog/catalog.router';
import requestsRouter from './modules/requests/requests.router';
import ordersRouter from './modules/orders/orders.router';
import stockRouter from './modules/stock/stock.router';
import adminRouter from './modules/admin/admin.router';
import reportsRouter from './modules/reports/reports.router';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/', catalogRouter); // Mounts /articles, /categories, /suppliers
apiRouter.use('/requests', requestsRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/stock', stockRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/reports', reportsRouter);

app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 API accessible at http://localhost:${PORT}/api`);
  });
}

export default app;
