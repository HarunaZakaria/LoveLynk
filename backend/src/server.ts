import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database';
import connectRedis from './config/redis';
import { errorHandler, notFound } from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import discoveryRoutes from './routes/discovery';
import matchRoutes from './routes/matches';
import chatRoutes from './routes/chats';
import questRoutes from './routes/quests';
import personalityRoutes from './routes/personality';
import subscriptionRoutes from './routes/subscriptions';
import notificationRoutes from './routes/notifications';
import safetyRoutes from './routes/safety';

// Socket handlers
import socketHandler from './socket/socketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter);

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/personality', personalityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/safety', safetyRoutes);

// Socket.io
io.on('connection', (socket: any) => socketHandler(socket, io));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize connections
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io server ready`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };
export default app;

