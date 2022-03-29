import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

// FIX: stay always on bottom
const Wrapper = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  padding: 40px;
  p {
    font-weight: bold;
    padding-left: 6px;
  }
`;

const Footer: NextPage = function Footer() {
  return (
    <Wrapper>
      Made with ❤️‍🩹 by <p>Facundo Veliz</p>
    </Wrapper>
  );
};

export default Footer;
