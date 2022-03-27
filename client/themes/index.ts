import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  background: '#f0f3f6',
  foreground: '#121620',
  primary: '#293851',
  secondary: '#728397',
  error: '#f44336',
  border: '#d4d4d4',
  divider: '#fff',
};

export const darkTheme = {
  background: '#121620',
  foreground: '#f1f1f1',
  primary: '#c3341d',
  secondary: '#ebb100',
  border: '#fff',
  divider: '#fff',
};

export type ThemeType = {
  theme: typeof darkTheme;
};

export const GlobalStyle = createGlobalStyle<ThemeType>`
  body {
    transition: background 0.2s ease-in, color 0.2s ease-in;
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
  }
`;
