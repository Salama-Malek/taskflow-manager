import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLanguageContext } from "../context/LanguageContext";
import type { SupportedLanguage } from "../i18n";

const labels: Record<string, string> = {
  en: "English",
  ar: "العربية",
  ru: "Русский"
};

const FlagIcon = ({ language }: { language: SupportedLanguage }) => {
  switch (language) {
    case "en":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 640 480"
          className="h-5 w-7 rounded border border-white/40 shadow"
          aria-hidden="true"
        >
          <path fill="#bd3d44" d="M0 0h640v480H0z" />
          <path
            stroke="#fff"
            strokeWidth="37"
            d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
          />
          <path fill="#192f5d" d="M0 0h296v259H0z" />
          <g fill="#fff">
            <g id="d">
              <g id="c">
                <g id="e">
                  <g id="b">
                    <path id="a" d="m32 36 10 30H11l25-18.2L21 66z" />
                    <use xlinkHref="#a" x="56" />
                    <use xlinkHref="#a" x="112" />
                    <use xlinkHref="#a" x="168" />
                    <use xlinkHref="#a" x="224" />
                  </g>
                  <use xlinkHref="#a" y="43" x="28" />
                  <use xlinkHref="#a" y="43" x="84" />
                  <use xlinkHref="#a" y="43" x="140" />
                  <use xlinkHref="#a" y="43" x="196" />
                  <use xlinkHref="#a" y="43" x="252" />
                </g>
                <use xlinkHref="#b" y="86" />
              </g>
              <use xlinkHref="#c" y="172" />
            </g>
            <use xlinkHref="#d" y="86" />
          </g>
        </svg>
      );
    case "ar":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 480"
          className="h-5 w-7 rounded border border-white/40 shadow"
          aria-hidden="true"
        >
          <path fill="#ce1126" d="M0 0h640v480H0z" />
          <path fill="#fff" d="M0 160h640v160H0z" />
          <path fill="#000" d="M0 160h640v160H0z" transform="translate(0 -160)" />
          <g transform="translate(0 -56)">
            <path fill="#fff" d="M0 216h640v160H0z" />
            <path fill="#000" d="M0 216h640v160H0z" transform="translate(0 -160)" />
          </g>
          <path
            fill="#fff5c5"
            d="M320 240c-23 0-41 18-41 40s18 40 41 40c11 0 21-4 28-11a25 25 0 0 1-20 10c-14 0-25-11-25-25s11-25 25-25c8 0 15 3 20 9a40 40 0 0 0-28-12"
          />
        </svg>
      );
    case "ru":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 480"
          className="h-5 w-7 rounded border border-white/40 shadow"
          aria-hidden="true"
        >
          <path fill="#fff" d="M0 0h640v160H0z" />
          <path fill="#0039a6" d="M0 160h640v160H0z" />
          <path fill="#d52b1e" d="M0 320h640v160H0z" />
        </svg>
      );
    default:
      return null;
  }
};

const LanguageSwitcher = () => {
  const { language, setLanguage, availableLanguages } = useLanguageContext();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-white/90 via-white/80 to-white/60 px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/40 ring-1 ring-white/40 transition hover:shadow-xl dark:from-slate-800/80 dark:via-slate-800/70 dark:to-slate-900/70 dark:text-slate-100 dark:ring-slate-700/60">
        <FlagIcon language={language} />
        <span className="hidden sm:inline-block">{labels[language]}</span>
        <ChevronDownIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition duration-150 ease-out"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition duration-100 ease-in"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-2xl border border-slate-200/60 bg-white/95 p-2 shadow-2xl shadow-slate-900/20 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/90">
          {availableLanguages.map((code) => (
            <Menu.Item key={code}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active || code === language
                      ? "bg-accent-light/15 text-accent-light dark:bg-accent-dark/20 dark:text-accent-dark"
                      : "text-slate-600 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <FlagIcon language={code as SupportedLanguage} />
                  <span className="flex-1 text-left">{labels[code]}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSwitcher;
