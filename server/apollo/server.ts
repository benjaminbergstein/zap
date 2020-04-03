const { ApolloServer, gql } = require('apollo-server');

import typeDefs from './schema'
import resolvers from './resolvers'

const server = new ApolloServer({ typeDefs, resolvers });

const callback: (data: any) => void = (data) => {
  console.log(`Server ready at ${data.url}`);
}

server.listen(process.env.PORT).then(callback)
