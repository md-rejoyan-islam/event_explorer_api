import { ApolloServer } from "@apollo/server";

import resolvers from "../graphql/resolvers/index";
import typeDefs from "../graphql/typedefs/index";

const createGraphQLServer = async () => {
  const gqlServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers as any,
  });

  // start the server
  await gqlServer.start();

  return gqlServer;
};

export default createGraphQLServer;
