const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:3001'];

export const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'CSRF-Token'],
  credentials: true,
};
