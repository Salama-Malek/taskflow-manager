import { useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { defaultLanguage, i18n, languages, SupportedLanguage } from "../i18n";

const languageClassMap: Record<SupportedLanguage, string> = {
  en: "ltr",
  ar: "rtl",
  ru: "ru"
};

export const useLanguage = () => {
  const [language, setLanguage] = useLocalStorage<SupportedLanguage>("taskflow-language", defaultLanguage);

  useEffect(() => {
    void i18n.changeLanguage(language);

    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const dir = language === "ar" ? "rtl" : "ltr";
    root.setAttribute("dir", dir);
    root.setAttribute("lang", language);

    Object.values(languageClassMap).forEach((cls) => root.classList.remove(cls));
    root.classList.add(languageClassMap[language]);
  }, [language]);

  const isRTL = language === "ar";

  return useMemo(
    () => ({
      language,
      setLanguage,
      isRTL,
      availableLanguages: languages
    }),
    [language, isRTL]
  );
};
