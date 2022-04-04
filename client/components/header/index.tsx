import React, { useContext } from 'react';
import type { NextPage } from 'next';
import { Button } from '../styles/Button';
import { Brand, OptionsWrapper, Wrapper } from './styles';
import Link from 'next/link';
import { ThemeContext } from '../userContext';
import { darkTheme, lightTheme } from '../../themes';

const Header: NextPage = function Header() {
  const { currentTheme, setCurrentTheme } = useContext(ThemeContext);

  return (
    <Wrapper>
      <Brand>Personal Budget</Brand>
      <OptionsWrapper>
        {currentTheme === lightTheme ? (
          <p onClick={() => setCurrentTheme(darkTheme)}>🌕</p>
        ) : (
          <p onClick={() => setCurrentTheme(lightTheme)}>🌞</p>
        )}
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
