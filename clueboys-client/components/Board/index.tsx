import React from 'react'
import styled from 'styled-components'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import LegendCard from './LegendCard'
import WordCard from './WordCard'

const FETCH_GAME = gql`
  query FetchCards($gameId: ID!) {
    boardCards: gameCards(gameId: $gameId, location: "board") {
      id
    }
    mapCards: gameCards(gameId: $gameId, location: "map") {
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
  boardCards: Card[]
  mapCards: Card[]
}

const Wrapper = styled.div`
  font-size: 1.5vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const Map = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 250px;
`


const Board: React.FC<Props> = ({ gameId }) => {
  const { loading, error, data } = useQuery(FETCH_GAME, {
    variables: { gameId },
  })

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  const { boardCards, mapCards }: GameCardsResponse  = data

  return <>
    <Wrapper>
      {boardCards.map(({ id: cardId }) => <WordCard cardId={cardId} />)}
    </Wrapper>
    <Map>
      {mapCards.map(({ id: cardId }) => <LegendCard cardId={cardId} />)}
    </Map>
  </>
}

export default Board
