import { gql } from 'apollo-boost'

export const FETCH_CARD_ATTRIBUTES = gql`
  query FetchCardAttributes($cardId: ID!) {
    cardAttributes(cardIds: [$cardId]) {
      name
      value
    }
  }
`
