import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const Main = styled.h1`
  display: flex;
  justify-content: center;
  padding: 12px;
  font-size: 14px;
`;

const Footer: NextPage = function Header() {
  return (
    <Main>
      Made with 🖤 by Facundo Veliz
    </Main>
  );
};

export default Footer;
