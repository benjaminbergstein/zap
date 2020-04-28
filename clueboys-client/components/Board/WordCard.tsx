import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks';

import { FETCH_CARD_ATTRIBUTES } from '../../apollo/queries'
import { getAttributeValue } from '../../apollo/utils'

interface Props {
  cardId: string
}

const Wrapper = styled.div`
  flex-basis: 20%;
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
`

const BoardCard = styled.div`
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #F4B745;
  color: #B78934;
  flex-grow: 1;
  margin: 10px;
  text-align: center;
  padding: 2.5vw 0;
`

const Card: React.FC<Props> = ({ cardId }) => {
  const { loading, error, data } = useQuery(FETCH_CARD_ATTRIBUTES, {
    variables: { cardId },
  })

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  const { cardAttributes } = data
  const label = getAttributeValue(cardAttributes, 'word')
  return <Wrapper><BoardCard>{label}</BoardCard></Wrapper>
}

export default Card
