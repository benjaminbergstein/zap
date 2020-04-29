import { withData } from 'next-apollo'
import { BatchHttpLink } from "apollo-link-batch-http";
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const isServer = !process.browser
const serverUri = process.env.SERVER_URL
const clientUri = publicRuntimeConfig.CLIENT_URL

const config = {
  link: new BatchHttpLink({
    uri: isServer ? serverUri : clientUri,
    batchInterval: 300,
  })
}

export default (Component: any) => {
  return withData(config)(Component)
}
