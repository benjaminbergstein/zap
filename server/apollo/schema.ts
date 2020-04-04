const { gql } = require('apollo-server');

export default gql`
  type Player {
    id: Int!
    name: String!
    games: [Game]!
  }

  type Game {
    id: ID!
    title: String!
    creator: Player
    players: [Player]!
  }

  type Query {
    games(includePlayers: Boolean): [Game]!
    players: [Player]!
    me(token: String!): Player
  }

  type Authorization {
    token: String!
  }

  type Mutation {
    signUp(name: String!): Authorization!
    signIn(name: String!): Authorization!
  }
`
