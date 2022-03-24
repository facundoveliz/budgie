import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const Main = styled.p`
  display: flex;
  align-items: center;
  padding: 12px;
`;

const Button = styled.button`
  margin-right: 10px;
  background-color:  ${({ theme }) => theme.body};
  border: 0;
  font-size: 30px;
`;

type Props = {
  toggleTheme: () => void;
  isDarkTheme: boolean;
};

const Header: NextPage<Props> = function Header({ toggleTheme, isDarkTheme }: Props) {
  return (
    <Main>
      <Button onClick={toggleTheme} type="button">
        {isDarkTheme
          ? (
            <span aria-label="Light mode" role="img">
              🌕
            </span>
          )
          : (
            <span aria-label="Dark mode" role="img">
              🌞
            </span>
          )}
      </Button>
      <h1>Header</h1>
    </Main>
  );
};

export default Header;
