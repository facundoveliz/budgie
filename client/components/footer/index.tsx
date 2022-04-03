import React from 'react';
import type { NextPage } from 'next';
import { Wrapper } from './styles';

const Footer: NextPage = function Footer() {
  return (
    <Wrapper>
      Made with ❤️‍🩹 by <p>Facundo Veliz</p>
    </Wrapper>
  );
};

export default Footer;
