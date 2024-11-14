import userModel from "../model/user.model.js";
import { userResolver } from "./user/userResolver.graphql.user.js";

const resolvers = {
    ...userResolver
};

export { resolvers };