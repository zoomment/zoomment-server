import mongoose from './services/mongoose';
import { auth } from './services/express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express, { ErrorRequestHandler } from 'express';
import http from 'http';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import api from './api';
import { migrate } from './migrations';
import { AppError } from '@/utils';
import { swaggerSpec } from './services/swagger';

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 15) {
  console.error('JWT_SECRET must be at least 15 characters');
  process.exit(1);
}

const app = express();

// Trust proxy - required for express-rate-limit to work correctly behind reverse proxies
app.set('trust proxy', 1);

mongoose.connect(process.env.MONGODB_URI || '');

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per window
  message: { message: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(auth());

// Apply rate limiting
app.use('/api', generalLimiter);
app.use('/api/users/auth', authLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Swagger documentation
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Zoomment API Docs'
  })
);

// Swagger JSON endpoint
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api', api);

// Error handler
// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  const errorMessage = err.message || 'Something went wrong!';
  const errorStatus = err.status || 500;
  res.status(errorStatus).json({ message: errorMessage });
};

app.use(errorHandler);

const server = http.createServer(app);
setImmediate(() => {
  server.listen(process.env.PORT, () => {
    console.log('Express server listening on http://localhost:%s/', process.env.PORT);
    console.log('API Docs available at http://localhost:%s/docs', process.env.PORT);
  });
});

if (process.env.MIGRATION) {
  migrate()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch(e => {
      console.error('Migration failed:', e);
      process.exit(1);
    });
}

export default app;
