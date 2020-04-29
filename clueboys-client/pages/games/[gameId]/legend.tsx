import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import withData from '../../../apollo/withData'
import Board from '../../../components/Board'

const Page = styled.div`
font-family: "Helvetica Neue", sans-serif
`

const Home: React.FC<any> = () => {
  const router = useRouter()
  const { gameId } = router.query

  return <Page>
    <Board gameId={gameId as string} />
  </Page>
}

export default withData(Home)
