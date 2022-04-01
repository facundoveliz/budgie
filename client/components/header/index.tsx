import React from 'react';
import type { NextPage } from 'next';
import { Button } from '../styles/Button';
import { Brand, OptionsWrapper, Wrapper } from './styles';
import Link from 'next/link';

const Header: NextPage = function Header() {
  return (
    <Wrapper>
      <Brand>Personal Budget</Brand>
      <OptionsWrapper>
        <Link passHref href="/">
          <p>Budget</p>
        </Link>
        <Link passHref href="/profile">
          <p>Profile</p>
        </Link>
        <Button
          onClick={() => {
            localStorage.removeItem('x-auth-token');
            window.location.href = '/login';
          }}
        >
          Logout
        </Button>
      </OptionsWrapper>
    </Wrapper>
  );
};

export default Header;
