import { buildSchema } from "graphql";

const userSchema = buildSchema(`

    type Notification {
      id: ID!
      type: String!
      message: String!
      timestamp: String!
    }
      
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
      notifications: [Notification]
      lastLogin: String
      createdAt: String
      updatedAt: String
      dob: String
    }
  
    input UserInput {
      username: String!
      email: String!
      password: String!
      name: String!
    }

    input UserDOB {
      redisKeyfromClient: String!
      dob: String!
    }

    type Mutation {
      addUser(input: UserInput): User
      addUserDOB(input: UserDOB) :User
    }
  
    input UserFilter {
      username: String
      email: String
    }

    type Query {
      users: [User]!
      getUser(filter: UserFilter!): User
    }
`);

export { userSchema };