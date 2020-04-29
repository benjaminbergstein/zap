import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks';

import { FETCH_CARD_ATTRIBUTES } from '../../apollo/queries'
import { getAttributeValue } from '../../apollo/utils'
import Wrapper from './CardWrapper'

interface Props {
  cardId: string
  isHidden: boolean
}

const Colors: { [affiliation: string]: string } = {
  blue: '#005aff',
  red: '#d14343',
  assassin: 'black',
  neutral: '#f4d498',
}

const MapComponent = styled.div`
  padding: 20px;
  border: 1px solid white;
  flex-grow: 1;
  background: ${(props: { affiliation: string }) => Colors[props.affiliation] || 'orange'}
`

const Card: React.FC<Props> = ({ cardId, isHidden }) => {
  const { loading, error, data } = useQuery(FETCH_CARD_ATTRIBUTES, {
    variables: { cardId },
  })

  if (isHidden) return null
  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>...</div>

  const { cardAttributes } = data
  const position = getAttributeValue(cardAttributes, 'position')
  const affiliation = getAttributeValue(cardAttributes, 'affiliation')

  return <Wrapper position={position}><MapComponent affiliation={affiliation} /></Wrapper>
}

export default Card
