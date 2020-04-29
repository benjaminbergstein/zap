import React from 'react'
import styled from 'styled-components'
import withData from '../apollo/withData'
import Board from '../components/Board'

const Page = styled.div`
font-family: "Helvetica Neue", sans-serif
`

const Home: React.FC<any> = () => {
  return <Page>
    <Board gameId="1" />
  </Page>
}

export default withData(Home)
