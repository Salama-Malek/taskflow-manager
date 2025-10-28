import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeContext();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? t("labels.light") : t("labels.dark")}
      className="relative flex h-10 w-[3.6rem] min-w-[3.6rem] items-center justify-between rounded-full bg-gradient-to-r from-slate-100/90 via-white/80 to-white/70 p-1 text-slate-600 shadow-lg shadow-slate-200/40 ring-1 ring-white/40 transition hover:shadow-xl dark:from-slate-700/70 dark:via-slate-800/70 dark:to-slate-900/70 dark:text-slate-100 dark:ring-slate-700/60"
    >
      <motion.span
        className="absolute inset-y-1 w-[46%] rounded-full bg-accent-light shadow-lg shadow-accent-light/40 dark:bg-accent-dark dark:shadow-accent-dark/40"
        animate={{ x: isDark ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
      />
      <span className="relative flex flex-1 items-center justify-center">
        <SunIcon className={`h-5 w-5 ${isDark ? "text-slate-300" : "text-white"}`} />
        <span className="sr-only">{t("labels.light")}</span>
      </span>
      <span className="relative flex flex-1 items-center justify-center">
        <MoonIcon className={`h-5 w-5 ${isDark ? "text-white" : "text-slate-300"}`} />
        <span className="sr-only">{t("labels.dark")}</span>
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
