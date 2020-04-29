import { withData } from 'next-apollo'
import { HttpLink } from 'apollo-boost'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const isServer = !process.browser
const serverUri = process.env.SERVER_URL
const clientUri = publicRuntimeConfig.CLIENT_URL

const config = {
  link: new HttpLink({
    uri: isServer ? serverUri : clientUri
  })
}

export default (Component: any) => {
  return withData(config)(Component)
}
