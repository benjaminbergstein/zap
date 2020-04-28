import React from 'react'
import styled from 'styled-components'

import { withData } from 'next-apollo'
import { HttpLink } from 'apollo-boost'

import Board from '../components/Board'

const isServer = !process.browser
const serverUri = 'http://server:3000'
const clientUri = 'http://production.wips.link:11000'

const config = {
  link: new HttpLink({
    uri: isServer ? serverUri : clientUri
  })
}

const Page = styled.div`
font-family: "Helvetica Neue", sans-serif
`

const Home: React.FC<any> = () => {
  return <Page>
    <Board gameId="37" />
  </Page>
}

export default withData(config)(Home)
