import { buildSchema } from "graphql";

const userSchema = buildSchema(`
    type User {
      id: ID!
      username: String!
      email: String!
      bio: String
      website: String
      profilePicture: String
      isPrivate: Boolean
      followersCount: Int
      followingCount: Int
      followers: [ID]
      following: [ID]
      posts: [ID]
      savedPosts: [ID]
      isVerified: Boolean
      notifications: Boolean
      lastLogin: String
      createdAt: String
      updatedAt: String
    }
  
    input UserInput {
      username: String!
      email: String!
      password: String!
      name: String!
    }

    input UserDOB {
      dob: String!
    }

    type Mutation {
      addUser(input: UserInput): User
      addUserDOB(input: UserDOB) :User
    }
  
    type Query {
      users: [User]!
      getUserByUsername(username: String!): User
      getUserByEmail(email: String!): User
    }
`);

export { userSchema };