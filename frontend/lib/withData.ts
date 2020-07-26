import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { getDataFromTree } from "@apollo/react-ssr";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/link-error";
import withApollo from "next-with-apollo";

function createClient({ headers, initialState }) {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}.`);
      }),
      createUploadLink({
        uri: process.env.NEXT_PUBLIC_API_URL + "/graphql",
        fetchOptions: {
          credentials: "include",
        },
        headers,
      }),
    ]),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default withApollo(createClient, { getDataFromTree });
