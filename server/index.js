import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema.graphql.js';
import { resolvers } from './graphql/resolvers.graphql.js';
import cors from 'cors';
import { config } from 'dotenv';
config();
import connection from './db/connection.db.js';

const app = express();
const PORT = 3000;

connection(process.env.DB_URL);

app.use(cors({
  origin: 'http://localhost:5173/', // Only allow this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies with requests if needed
}));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/graphql', graphqlHTTP({ schema, rootValue: resolvers, graphiql: true }))

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
