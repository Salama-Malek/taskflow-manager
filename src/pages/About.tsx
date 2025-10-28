import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel mx-auto max-w-3xl rounded-3xl p-8"
    >
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t("pages.about.headline")}</h2>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{t("pages.about.content")}</p>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200/60 p-6 dark:border-slate-700/60">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("modal.aboutTitle")}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{t("modal.aboutDescription")}</p>
      </div>
    </motion.section>
  );
};

export default About;
