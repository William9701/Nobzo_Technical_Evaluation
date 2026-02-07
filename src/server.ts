import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Blog API Documentation',
}));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Blog API is running',
    documentation: 'http://localhost:3000/api-docs',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
      },
      posts: {
        create: 'POST /api/posts (authenticated)',
        getAll: 'GET /api/posts',
        getBySlug: 'GET /api/posts/:slug',
        update: 'PUT /api/posts/:id (authenticated)',
        delete: 'DELETE /api/posts/:id (authenticated)',
      },
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
