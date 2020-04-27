const { gql } = require('apollo-server');

export default gql`
  type Player {
    id: ID!
    name: String!
    games: [Game]!
  }

  type Game {
    id: ID!
    title: String!
    creator: Player
    players: [Player]!
  }

  type GameAttribute {
    name: String!
    value: String!
  }

  type Card {
    id: ID!
    slug: String!
  }

  type CardAttribute {
    cardId: ID!
    name: String!
    value: String!
  }

  type Query {
    games(includePlayers: Boolean): [Game]!
    players: [Player]!
    me(token: String!): Player
    gameAttributes(gameId: Int!): [GameAttribute]
    gameCards(gameId: Int!): [Card]
    cardAttributes(cardIds: [Int]!): [CardAttribute]
  }

  type Authorization {
    token: String!
  }

  type Mutation {
    signUp(name: String!): Authorization!
    signIn(name: String!): Authorization!
    createGameAttribute(gameId: Int!, name: String!, value: String!): GameAttribute
    createGame(token: String!, title: String!, template: String!): Game
  }
`
