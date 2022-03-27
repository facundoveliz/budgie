import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const Main = styled.h1`
  display: flex;
  justify-content: center;
  padding: 12px;
  font-size: 24px;
`;

const Header: NextPage = function Header() {
  return (
    <Main>
      Header
    </Main>
  );
};

export default Header;
