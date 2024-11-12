import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import path from 'path';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/graphql', graphqlHTTP({ schema, rootValue: resolvers, graphiql: true }))

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
