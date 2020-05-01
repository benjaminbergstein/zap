import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useMutation } from '@apollo/react-hooks';
import Router from 'next/router'
import getConfig from 'next/config'

import withData from '../apollo/withData'
import { CREATE_GAME } from '../apollo/queries'

const { publicRuntimeConfig } = getConfig()
const token = publicRuntimeConfig.TOKEN

const Page = styled.div`
  font-family: "Helvetica Neue", sans-serif
`

const Home: React.FC<any> = () => {
  const [title, setTitle] = useState<string>('')
  const [createGame, { called, data, loading }] =  useMutation(CREATE_GAME, {
    variables: { title, token }
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    createGame()
  }

  useEffect(() => {
    if (called && data) {
      const { createGame: { id } } = data
      Router.push(`/games/${id}`, undefined, { shallow: true })
    }
  }, [called, data])

  return <Page>
    <h1>Create a game</h1>
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <div>Name</div>
          <div>
            <input defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <button disabled={loading} onClick={handleSubmit}>Create</button>
          </div>
        </label>
      </form>
    </div>
  </Page>
}

export default withData(Home)
