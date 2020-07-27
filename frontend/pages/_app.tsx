import App, { AppProps } from "next/app";
import {
  ApolloProvider,
  ApolloClient,
  NormalizedCacheObject,
} from "@apollo/client";
import withData from "../lib/withData";
import Page from "../components/Page";

interface AppPropsWithApollo extends AppProps {
  apollo: ApolloClient<NormalizedCacheObject>;
}

class Readingly extends App<AppPropsWithApollo> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = { query: {} };
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.query = ctx.query;
    return { pageProps };
  }

  render(): JSX.Element {
    const { Component, apollo, pageProps } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    );
  }
}

export default withData(Readingly);
