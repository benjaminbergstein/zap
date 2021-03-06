import { gql } from 'apollo-boost'

export const CREATE_GAME = gql`
  mutation CreateGame($title: String!, $token: String!) {
    createGame(
      title: $title,
      template: "clueboys",
      token: $token,
    ) {
      id
    }
  }
`

export const FETCH_GAME = gql`
  query FetchCards($gameId: ID!) {
    boardCards: gameCardsWithAttribute(
      gameId: $gameId,
      attribute: { name: "location", value: "board" }
    ) {
      id
    }
    mapCards: gameCardsWithAttribute(
      gameId: $gameId,
      attribute: { name: "location", value: "map" }
    ) {
      id
    }
  }
`

export const QUERY_GAME_CARDS = gql`
  query FetchCardWithAttribute($gameId: ID!, $name: String!, $value: String!) {
    gameCardsWithAttribute(
      gameId: $gameId,
      attribute: { name: $name, value: $value }
    ) {
      id
    }
  }
`

export const FETCH_CARD_ATTRIBUTES = gql`
  query FetchCardAttributes($cardId: ID!) {
    cardAttributes(cardIds: [$cardId]) {
      id
      name
      value
    }
  }
`

export const SET_CARD_ATTRIBUTE_VALUE = gql`
  mutation SetCardAttributeValue($cardId: ID!, $name: String!, $value: String!) {
    setCardAttributeValue(cardId: $cardId, name: $name, value: $value) {
      id
      name
      value
    }
  }
`
