import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  background: '#cecece',
  backgroundSoft: '#dadada',
  foreground: '#111827',
  foregroundSoft: '#3a4150',
  primary: '#30b27b',
  secondary: '#2089ff',
  danger: '#e24f44',
  border: '#bdbdbd',
  divider: '#fff',
  fonts: {},
  paddings: {
    dashboard: '32px',
  },
  margins: {},
  borders: {
    radius: '8px',
  },
};

export const darkTheme = {
  background: '#16181c',
  backgroundSoft: '#26292f',
  foreground: '#ecf9fb',
  foregroundSoft: '#929aa3',
  primary: '#1bd96a',
  secondary: '#74b6f3',
  danger: '#e24f44',
  border: '#242424',
  divider: '#fff',
  fonts: {},
  paddings: {
    dashboard: '32px',
  },
  margins: {},
  borders: {
    radius: '16px',
  },
};

export type ThemeType = {
  theme: typeof darkTheme;
};

export const GlobalStyle = createGlobalStyle<ThemeType>`
  html, body {
    transition: background 0.2s ease-in, color 0.2s ease-in;
    margin: 0;
    padding: 0;
    p {
      margin: 0;
      padding: 0;
    }
    h1 {
      letter-spacing: 1px;
    }
    font-size: 20px;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
  }
}`;
