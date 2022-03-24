import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyle } from '../themes/index';

import Header from '../components/header/index';

const Home: NextPage = function Home() {
  const [theme, setTheme] = useState('light');
  const isDarkTheme = theme === 'dark';

  const toggleTheme = () => {
    const updatedTheme = isDarkTheme ? 'light' : 'dark';
    setTheme(updatedTheme);
    localStorage.setItem('theme', updatedTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Header toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      <p>Index</p>
    </ThemeProvider>
  );
};
export default Home;
