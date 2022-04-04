import { createContext } from 'react';
import { lightTheme } from '../themes';

type ContextType = {
  currentTheme: typeof lightTheme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<typeof lightTheme>>;
};

export const ThemeContext = createContext<ContextType | null>(null);
