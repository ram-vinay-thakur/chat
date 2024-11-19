import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema.graphql.js';
import { resolvers } from './graphql/resolvers.graphql.js';
import cors from 'cors';
import { config } from 'dotenv';
config(); 
import connection from './db/connection.db.js';
import redis from './redis/redisClient.js';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { validatecsrfToken, csrfProtection } from './middlewares/csrufToken.middleware.js'

const app = express();
const PORT = 3000;

// DB connection
connection(process.env.DB_URL);

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Rate limits to prevent too many requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});

// Cookie parser middleware
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:3001']
// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'CSRF-Token'],
  credentials: true,
}));

app.use(csrfProtection);

// Rate limiting
app.use(limiter);

// Response compression
app.use(compression());

// GraphQL Middleware
app.use(
  '/graphql',
  csrfProtection,
  validatecsrfToken,
  graphqlHTTP((req, res) => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: { req, res },
  }))
);


// Default route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/api/data', (req, res) => {
  res.cookie('myCookie', 'cookieValue', { httpOnly: true, secure: false }); // cookie settings
  res.json({ message: 'Cookie sent!' });
});

app.get('/form', csrfProtection, (req, res) => {
  // Send CSRF token to the frontend
  res.send({
    csrfToken: req.csrfToken(),
  });
});


// Redis client setup
redis.on('connect', () => console.log('Connected to Redis!'));
redis.on('error', (err) => console.error('Redis error:', err));

// App running
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
