import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

const connectRedis = async (): Promise<void> => {
  try {
    const redisUrl = process.env.REDIS_URL;
    
    // Redis is optional - skip if not configured
    if (!redisUrl) {
      console.log('⚠️  Redis not configured - skipping connection');
      return;
    }

    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis Connected');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection error:', error);
    console.log('⚠️  Continuing without Redis - some features may be limited');
    // Don't exit - Redis is optional for some features
  }
};

// Export a getter function to safely access redisClient
export const getRedisClient = () => redisClient;

export default connectRedis;

