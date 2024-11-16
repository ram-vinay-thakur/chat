// redisClient.js
import Redis from 'redis';
import { ApiError } from '../utils/ApiError.js';

const redis = Redis.createClient();
redis.connect()
export default redis;
