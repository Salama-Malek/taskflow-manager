import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import { useTheme, type Theme } from "../hooks/useTheme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { theme, toggleTheme, setTheme } = useTheme();

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme
    }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};
