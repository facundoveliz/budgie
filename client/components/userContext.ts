import { createContext } from 'react';
import { darkTheme } from '../themes';

type ContextType = {
  currentTheme: typeof darkTheme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<typeof darkTheme>>;
};

export const ThemeContext = createContext<ContextType>({
  currentTheme: darkTheme,
  setCurrentTheme: () => {},
});
