import { Bars3Icon, PlusCircleIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useTaskContext } from "../context/TaskContext";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

export interface HeaderProps {
  onAddTask: () => void;
  onToggleSidebar: () => void;
}

const Header = ({ onAddTask, onToggleSidebar }: HeaderProps) => {
  const { t } = useTranslation();
  const { searchTerm, setSearchTerm } = useTaskContext();
  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearchActive, setSearchActive] = useState(false);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        setSearchActive(true);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-slate-200/40 bg-white/70 px-4 py-4 backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-900/60 md:px-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-full border border-slate-200/60 bg-white/70 p-2 text-slate-600 transition hover:border-accent-light hover:text-accent-light dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-accent-dark dark:hover:text-accent-dark md:hidden"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <Logo variant="icon" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">{t("app.title")}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">{t("app.subtitle")}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
          <div
            className={`relative max-w-md flex-1 md:flex-none ${
              isSearchActive ? "scale-[1.01]" : ""
            } transition-transform`}
          >
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </div>
            <input
              ref={searchRef}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
              placeholder={t("labels.search")}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 py-2.5 pl-10 pr-20 text-sm text-slate-700 shadow-sm shadow-slate-200/50 outline-none transition focus:border-accent-light focus:ring-4 focus:ring-accent-light/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-accent-dark dark:focus:ring-accent-dark/20"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-14 flex items-center text-slate-300 transition hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            ) : null}
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500">
              Ctrl + K
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 md:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onAddTask}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-light to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-light/40 transition hover:shadow-xl hover:shadow-accent-light/50 dark:from-accent-dark dark:to-sky-500"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>{t("buttons.add")}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
