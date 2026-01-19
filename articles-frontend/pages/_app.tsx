import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client/index.js";
import client from "@/lib/apollo-server-client";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
