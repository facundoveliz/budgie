import React from 'react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  // @ts-ignore, next-js stuff
  return <Component pageProps={pageProps} />;
}

export default MyApp;
