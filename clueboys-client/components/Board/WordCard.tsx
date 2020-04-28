import React, { useState } from 'react'
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

interface BoardCardProps {
  color: string
  background: string
}

const BoardCard = styled.div`
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #F4B745;
  background: ${(props: BoardCardProps) => props.background|| '#B78934'};
  color: ${(props: BoardCardProps) => props.color || '#B78934'};
  flex-grow: 1;
  margin: 10px;
  text-align: center;
  padding: 2.5vw 0;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

const Colors: { [affiliation: string]: string[] } = {
  blue: ['#005aff', '#d7e5ff'],
  red: ['#d14343', '#ffd0d0'],
  assassin: ['black', 'white'],
  neutral: ['#fff7e7', '#B78934'],
}

const getColorByIndex: (index: number) => string[] = (index) => {
  const color = Object.keys(Colors)[index]
  return Colors[color]
}

const Card: React.FC<Props> = ({ cardId }) => {
  const [colorIndex, setColorIndex] = useState<number>(3)
  const [background, color] = getColorByIndex(colorIndex)

  const { loading, error, data } = useQuery(FETCH_CARD_ATTRIBUTES, {
    variables: { cardId },
  })

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  const { cardAttributes } = data
  const label = getAttributeValue(cardAttributes, 'word')

  const handleClick: () => void = () => {
    const colorCount = Object.keys(Colors).length
    setColorIndex((colorIndex + 1) % colorCount)
  }

  return <Wrapper onClick={handleClick}>
    <BoardCard background={background} color={color}>
      {label}
    </BoardCard>
  </Wrapper>
}

export default Card
