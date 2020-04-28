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

const Card: React.FC<Props> = ({ cardId }) => {
  const { loading, error, data } = useQuery(FETCH_CARD_ATTRIBUTES, {
    variables: { cardId },
  })

  if (error) return <div>{JSON.stringify(error)}</div>
  if (loading) return <div>Loading...</div>

  const { cardAttributes } = data
  const affiliation = getAttributeValue(cardAttributes, 'affiliation')

  return <Wrapper><MapComponent affiliation={affiliation} /></Wrapper>
}

export default Card
