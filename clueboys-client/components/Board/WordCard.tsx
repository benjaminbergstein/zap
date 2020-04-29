import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';

import {
  FETCH_CARD_ATTRIBUTES,
  QUERY_GAME_CARDS,
  SET_CARD_ATTRIBUTE_VALUE,
} from '../../apollo/queries'
import { getAttributeValue, doesCardAttributeExist } from '../../apollo/utils'
import Wrapper from './CardWrapper'

interface Props {
  cardId: string
  gameId: string
}

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
  unknown: ['#fff7e7', '#B78934'],
  neutral: ['#b78834', '#fff6e7'],
}

const Card: React.FC<Props> = ({ gameId, cardId }) => {
  const [affiliation, setAffiliation] = useState<string>('unknown')
  const [isRevealed, setRevealed] = useState<boolean>(false)
  const [background, color] = Colors[isRevealed ? affiliation : 'unknown']
  const { loading, error, data } = useQuery(FETCH_CARD_ATTRIBUTES, {
    pollInterval: 1000,
    variables: { cardId },
  })
  const [getLegendCard, { called: legendCardCalled, data: legendCardData }] = useLazyQuery(QUERY_GAME_CARDS);
  const [getLegendCardAttributes, { data: legendCardAttributeData }] = useLazyQuery(FETCH_CARD_ATTRIBUTES);

  const [setCardAttributeValue] = useMutation(SET_CARD_ATTRIBUTE_VALUE, {
    update(cache, { data: { setCardAttributeValue } }) {
      const { name, value } = setCardAttributeValue
      const { cardAttributes: cachedCardAttributes } = cache.readQuery({
        query: FETCH_CARD_ATTRIBUTES,
        variables: { cardId },
      }) || { cardAttributes: [] };
      const cardAttributes = doesCardAttributeExist(cachedCardAttributes, name) ?
        cachedCardAttributes.reduce(
          (attributes: any, cachedAttribute: any) => {
            if (cachedAttribute.name !== name) {
              return [...attributes, cachedAttribute]
            }
            return [...attributes, { ...cachedAttribute, value }]
          }, []
        ) : [...cachedCardAttributes, { ...setCardAttributeValue, cardId }]

      cache.writeQuery({
        query: FETCH_CARD_ATTRIBUTES,
        variables: { cardId },
        data: { cardAttributes },
      })
    }
  })

  const notThisCard: (card: { id: string }) => boolean = ({ id }) => id != cardId

  const { cardAttributes = [] } = data || {}
  const position = getAttributeValue(cardAttributes, 'position', '0')
  const label = getAttributeValue(cardAttributes, 'word', '')
  const revealed = getAttributeValue(cardAttributes, 'revealed', '0') === '1'

  useEffect(() => { setRevealed(revealed) }, [revealed])

  useEffect(() => {
    if (!legendCardData) return

    const { gameCardsWithAttribute: possibleLegendCards } = legendCardData
    const legendCard = possibleLegendCards.find(notThisCard)
    getLegendCardAttributes({ variables: { cardId: legendCard.id } })
  }, [legendCardData])

  useEffect(() => {
    if (!legendCardAttributeData) return
    const { cardAttributes: legendCardAttributes } = legendCardAttributeData
    const color = getAttributeValue(legendCardAttributes, 'affiliation')
    setAffiliation(color)
  }, [legendCardAttributeData])

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  if (!legendCardCalled) {
    getLegendCard({
      variables: { gameId, name: "position", value: position }
    })
  }

  const handleClick: () => void = () => {
    setRevealed(true)
    setCardAttributeValue({
      variables: { cardId, name: "revealed", value: "1" },
    })
  }

  return <Wrapper position={position} onClick={handleClick}>
    <BoardCard background={background} color={color}>
      {label}
    </BoardCard>
  </Wrapper>
}

export default Card
