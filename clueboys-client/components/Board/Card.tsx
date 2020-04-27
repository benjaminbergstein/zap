import React from 'react'
import styled from 'styled-components'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';

const FETCH_CARD_ATTRIBUTES = gql`
  query FetchCardAttributes($cardId: ID!) {
    cardAttributes(cardIds: [$cardId]) {
      name
      value
    }
  }
`

interface Props {
  cardId: string
}

interface CardAttribute {
  name: string
  value: string
}

const getAttributeValue: (
  cardAttributes: CardAttribute[],
  attributeName: string
) => string = (cardAttributes, attributeName) => {
  const attribute = cardAttributes.find(({ name }) => name === attributeName)
  if (!attribute) throw `Attribute not found: ${attributeName}`
  return attribute.value
}

// interface CardAttributesResponse {
//   cardAttributes: CardAttribute[]
// }

const Wrapper = styled.div`
  flex-basis: 20%;
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  height: 20%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const Card: React.FC<Props> = ({ cardId }) => {
  const { loading, error, data } = useQuery(FETCH_CARD_ATTRIBUTES, {
    variables: { cardId },
  })

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  const word = getAttributeValue(data.cardAttributes, 'word')
  return <Wrapper>{word}</Wrapper>
}

export default Card
