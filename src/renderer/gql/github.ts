import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import ky from "ky";

const TEST = atob("Z2hwX2phMzJ1RUNDbmZsUzR1d05jY2FIRzR2N2s0Z1k1QTJwMDVRVQ==");

export default new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      authorization: `token ${TEST}`,
    },
    fetch: ky,
  }),
  cache: new InMemoryCache(),
});