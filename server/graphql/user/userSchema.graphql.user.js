import { buildSchema } from "graphql";

const userSchema = buildSchema(`

    type Notification {
      id: ID!
      type: String!
      message: String!
      timestamp: String!
    }
      
    type User {
      _id: ID!
      username: String!
      email: String!
      bio: String
      name: String
      website: String
      gender: String
      profilePicture: String
      isPrivate: Boolean
      followersCount: Int
      followingCount: Int
      followers: [User]
      following: [User]
      posts: [Post]
      savedPosts: [Post]
      isVerified: Boolean
      notifications: [Notification]
      lastLogin: String
      createdAt: String
      updatedAt: String
      dob: String
      twoFactorEnabled: Boolean
      role: String
      profileComplete: Boolean
      emailVerified: Boolean
      allowProfileDiscovery: Boolean
      allowPostSharing: Boolean
      address: String
      location: Location
      preferences: Preferences
      deleted: Boolean
      lastPostDate: String
      loginCount: Int
    }

    type Location {
      type: String
      coordinates: [Float]
    }

    type Preferences {
      language: String
      notificationsEnabled: Boolean
      contentFilter: String
      theme: String
    }
  
    type Post {
      _id: ID!
      content: String!
      createdAt: String!
    }
      
    type TempUser  {
      username: String!
      email: String!
      name: String!
      dob: String
      redisKey: String
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

    input getOTP {
      redisKey: String!
      otp: String!
    }

    type Mutation {
      addUser(input: UserInput): TempUser
      addUserDOB(input: UserDOB) :TempUser
      validateOtp(input: getOTP) :User
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