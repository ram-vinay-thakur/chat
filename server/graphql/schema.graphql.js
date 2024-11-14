import { makeExecutableSchema } from '@graphql-tools/schema';
import { userSchema } from './user/userSchema.graphql.user.js';

const schema = makeExecutableSchema({
  typeDefs: [userSchema],  
});

export { schema };
