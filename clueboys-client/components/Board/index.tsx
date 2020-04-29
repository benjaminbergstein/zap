import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks';
import LegendCard from './LegendCard'
import WordCard from './WordCard'
import { FETCH_GAME } from '../../apollo/queries'

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
  const [showLegend, setShowLegend] = useState<boolean>(false)
  const { loading, error, data } = useQuery(FETCH_GAME, {
    variables: { gameId },
  })

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  const { boardCards, mapCards }: GameCardsResponse  = data

  const revealLegend = () => {
    const hasConfirmed = confirm('Are you certain you want to reveal the legend? This is cheatin\' if you\'re not the codegiver')
    if (hasConfirmed) setShowLegend(true)
  }

  return <>
    <Wrapper>
      {boardCards.map(({ id: cardId }) => <WordCard gameId={gameId} cardId={cardId} />)}
    </Wrapper>
    <div>
      {!showLegend && <>
        <button onClick={revealLegend}>I am the codegiver, show the legend</button>
        <p>What's the fun in cheating?</p>
      </>}
      <Map>
        {mapCards.map(({ id: cardId }) => <LegendCard isHidden={!showLegend} cardId={cardId} />)}
      </Map>
      {showLegend && <a href="javascript:void(0)" onClick={() => setShowLegend(false)}>hide</a>}
    </div>
  </>
}

export default Board
