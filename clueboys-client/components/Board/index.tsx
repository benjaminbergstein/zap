import React from 'react'
import styled from 'styled-components'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import Card from './Card'

const FETCH_GAME = gql`
  query FetchCards($gameId: ID!) {
    gameCards(gameId: $gameId) {
      id
    }
  }
`

interface Card {
  id: string
}

interface Props {
  gameId: string
}

interface GameCardsResponse {
  gameCards: Card[]
}

const Wrapper = styled.div`
  width: 700px;
  height: 500px;
  font-size: 1.5vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const Board: React.FC<Props> = ({ gameId }) => {
  const { loading, error, data } = useQuery(FETCH_GAME, {
    variables: { gameId },
  })

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  const { gameCards }: GameCardsResponse  = data

  return <Wrapper>
    {gameCards.map(({ id: cardId }) => <Card cardId={cardId} />)}
  </Wrapper>
}

export default Board
