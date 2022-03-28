import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  background: '#f9f1db',
  foreground: '#5f4b32',
  primary: '#24ac6c',
  secondary: '#e46a4e',
  error: '#e46a4e',
  border: '#d9ccad',
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
    font-size: 20px;
    padding: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
  }
}`;
