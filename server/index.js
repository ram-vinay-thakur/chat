import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema.graphql.js';
import { resolvers } from './graphql/resolvers.graphql.js';
import cors from 'cors';
import { config } from 'dotenv';
import http from 'http';
import { Server } from 'socket.io'; // Import Socket.IO
import connection from './db/connection.db.js';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { validatecsrfToken, csrfProtection } from './middlewares/csrufToken.middleware.js';
import { corsOptions } from './config/cors.config.js';
import { handleSocketEvents } from './socket/socketHandler.js';

config();

const app = express();
const PORT = 3000;

// Create HTTP server and integrate it with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:3001'], // Allowed origins
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
handleSocketEvents(io);

// DB connection
connection(process.env.DB_URL);

// Session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// Rate limits to prevent too many requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Cookie parser middleware
app.use(cookieParser());

// CORS configuration
app.use(
  cors(corsOptions)
);

// CSRF protection
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


// App running
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
