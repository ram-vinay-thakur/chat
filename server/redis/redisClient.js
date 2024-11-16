// redisClient.js
import Redis from 'redis';
import { ApiError } from '../utils/ApiError.js';

const redis = Redis.createClient({
    host: '127.0.0.1', 
    port: 6379,        
});

export default redis;
