import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggle from "../components/ThemeToggle";

const Settings = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex max-w-4xl flex-col gap-6"
    >
      <div className="glass-panel rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t("pages.settings.headline")}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{t("pages.settings.content")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("labels.language")}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{t("messages.welcome")}</p>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("labels.theme")}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{t("pages.home.focus")}</p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Settings;
