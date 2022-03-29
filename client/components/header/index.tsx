import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { Button } from '../styles/Button';

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  padding: 4px 16px;
`;

const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: 20px;
    cursor: pointer;
  }
`;

const Brand = styled.h1`
  font-size: 24px;
  letter-spacing: 2px;
`;

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
