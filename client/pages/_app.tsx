import React, { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app';
import Layout from '../components/layout';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, lightTheme } from '../themes/index';
import { NextPage } from 'next';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // custom layout without header/footer for auth pages
  if (Component.getLayout) {
    return Component.getLayout(
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>,
    );
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
