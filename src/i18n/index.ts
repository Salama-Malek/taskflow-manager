import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";
import ru from "./ru.json";

export type SupportedLanguage = "en" | "ar" | "ru";

export const languages: SupportedLanguage[] = ["en", "ar", "ru"];
export const defaultLanguage: SupportedLanguage = "en";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      ru: { translation: ru }
    },
    fallbackLng: defaultLanguage,
    supportedLngs: languages,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "htmlTag", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "taskflow-language"
    }
  });

export { i18n };
