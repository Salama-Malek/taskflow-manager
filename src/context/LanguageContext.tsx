import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { SupportedLanguage } from "../i18n";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  isRTL: boolean;
  availableLanguages: SupportedLanguage[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const { language, setLanguage, isRTL, availableLanguages } = useLanguage();

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isRTL,
      availableLanguages
    }),
    [language, setLanguage, isRTL, availableLanguages]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return context;
};
