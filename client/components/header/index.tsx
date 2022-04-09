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
  // FIX: this
  // @ts-ignore
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
        <Link passHref href="/">
          <MenuItem onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <div>Budget</div>
          </MenuItem>
        </Link>
        <Link passHref href="/profile">
          <MenuItem onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <div>Profile</div>
          </MenuItem>
        </Link>
        <MenuItem onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <Button
            onClick={() => {
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
