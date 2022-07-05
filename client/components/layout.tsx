import Head from 'next/head';
import React, { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';

type Children = {
  children: ReactNode;
};

export default function Layout({ children }: Children) {
  return (
    <>
      <Head>
        <title>Personal Budget</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}
