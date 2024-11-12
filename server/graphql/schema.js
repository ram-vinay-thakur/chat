import { buildSchema } from "graphql";

const schema = buildSchema(` 
    type Game {
        id: ID!
        title: String!
        authorId: ID!
        ratingId: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Rating {
        id: ID!
        score: Int!
        comment: String
    }

    type Query {
        games: [Game!]!
        game(id: ID!): Game
        users: [User!]!
        user(id: ID!): User
        ratings: [Rating!]!
        rating(id: ID!): Rating
    }

    type Mutation {
        createGame(title: String!, authorId: ID!, ratingId: ID!): Game
        updateGame(id: ID!, title: String, authorId: ID, ratingId: ID): Game
        deleteGame(id: ID!): Game
    }`);

export { schema };