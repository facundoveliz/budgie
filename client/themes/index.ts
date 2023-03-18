import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  background: '#cecece',
  backgroundSoft: '#dadada',
  backgroundSofter: '#c1c1c1',
  foreground: '#111827',
  foregroundSoft: '#3a4150',
  foregroundSofter: '#868686',
  primary: '#30b27b',
  primarySoft: '#51d39c',
  secondary: '#2089ff',
  secondarySoft: '#3ca5f3',
  positive: '#59be6e',
  negative: '#e65348',
  danger: '#e14e43',
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
  backgroundSofter: '#31343a',
  foreground: '#ecf9fb',
  foregroundSoft: '#929aa3',
  foregroundSofter: '#707881',
  primary: '#1bd96a',
  primarySoft: '#6bffba',
  secondary: '#74b6f3',
  secondarySoft: '#88caff',
  positive: '#59be6e',
  negative: '#e65348',
  danger: '#e65348',
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
