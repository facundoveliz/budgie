import React, { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';

type Children = {
  children: ReactNode
};

export default function Layout({ children }: Children) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
