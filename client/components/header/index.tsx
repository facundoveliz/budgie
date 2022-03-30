import React from 'react';
import type { NextPage } from 'next';
import { Button } from '../styles/Button';
import { Brand, OptionsWrapper, Wrapper } from './styles';

const Header: NextPage = function Header() {
  return (
    <Wrapper>
      <Brand>Personal Budget</Brand>
      <OptionsWrapper>
        <p>Budget</p>
        <p>Profile</p>
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
