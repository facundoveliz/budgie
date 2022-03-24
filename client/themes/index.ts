import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  body: '#f1f1f1',
  text: '#121620',
};

export const darkTheme = {
  body: '#121620',
  text: '#f1f1f1',
};

export type ThemeType = {
  theme: typeof darkTheme
}

export const GlobalStyle = createGlobalStyle<ThemeType>`
  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    // transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;
