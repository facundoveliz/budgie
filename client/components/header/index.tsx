import React, { useState, useContext } from 'react';
import type { NextPage } from 'next';
import { Button } from '../styles/Button';
import {
  Brand,
  Hamburguer,
  Menu,
  MenuItem,
  OptionsWrapper,
  Wrapper,
} from './styles';
import Link from 'next/link';
import { ThemeContext } from '../userContext';
import { darkTheme, lightTheme } from '../../themes';

const Header: NextPage = function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { currentTheme, setCurrentTheme } = useContext(ThemeContext);

  return (
    <Wrapper>
      <Brand>Personal Budget</Brand>
      <Hamburguer onClick={() => setShowMobileMenu(!showMobileMenu)} />
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

      <Menu open={showMobileMenu}>
        <MenuItem onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <Link passHref href="/">
            <p>Budget</p>
          </Link>
        </MenuItem>
        <MenuItem onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <Link passHref href="/profile">
            <p>Profile</p>
          </Link>
        </MenuItem>
        <MenuItem onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <Button
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              localStorage.removeItem('x-auth-token');
              window.location.href = '/login';
            }}
          >
            Logout
          </Button>
        </MenuItem>
      </Menu>
    </Wrapper>
  );
};

export default Header;
