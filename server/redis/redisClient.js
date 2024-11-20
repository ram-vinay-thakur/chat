// redisClient.js
import Redis from 'redis';
import { ApiError } from '../utils/ApiError.js';

const redis = Redis.createClient();
redis.connect();

// Redis client setup
redis.on('connect', () => console.log('Connected to Redis!'));
redis.on('error', (err) => console.error('Redis error:', err));
export default redis;
