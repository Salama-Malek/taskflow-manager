import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  ChevronDoubleLeftIcon,
  Cog6ToothIcon,
  HomeModernIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onShowAbout: () => void;
}

const Sidebar = ({ isOpen, onToggle, onShowAbout }: SidebarProps) => {
  const { t } = useTranslation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
      isActive
        ? "bg-accent-light/10 text-accent-light dark:bg-accent-dark/10 dark:text-accent-dark"
        : "text-slate-600 hover:bg-slate-200/40 dark:text-slate-200 dark:hover:bg-slate-700/40"
    ].join(" ");

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 88 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="glass-panel relative hidden h-screen flex-col border-r border-slate-200/40 bg-white/60 p-4 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/50 md:flex md:sticky md:top-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 }}>
            <Logo variant={isOpen ? "full" : "icon"} className={isOpen ? "h-10 w-auto" : "h-10 w-10"} />
          </motion.div>
        </div>
        <button
          onClick={onToggle}
          className="rounded-full border border-slate-200/60 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-700/60 dark:text-slate-300 dark:hover:border-slate-600"
          aria-label="Collapse sidebar"
        >
          <ChevronDoubleLeftIcon className={`h-4 w-4 transition ${!isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        <NavLink to="/" className={navLinkClass}>
          <HomeModernIcon className="h-5 w-5" />
          {isOpen ? <span>{t("navigation.home")}</span> : null}
        </NavLink>
        <NavLink to="/statistics" className={navLinkClass}>
          <ChartBarIcon className="h-5 w-5" />
          {isOpen ? <span>{t("navigation.statistics")}</span> : null}
        </NavLink>
        <NavLink to="/settings" className={navLinkClass}>
          <Cog6ToothIcon className="h-5 w-5" />
          {isOpen ? <span>{t("navigation.settings")}</span> : null}
        </NavLink>
        <button
          onClick={onShowAbout}
          className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200/40 dark:text-slate-200 dark:hover:bg-slate-700/40"
          type="button"
        >
          <UserCircleIcon className="h-5 w-5" />
          {isOpen ? <span>{t("navigation.about")}</span> : null}
        </button>
      </nav>

      {isOpen ? (
        <div className="mt-auto hidden rounded-2xl border border-dashed border-slate-200/60 p-4 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-300 md:block">
          <p className="font-semibold text-slate-700 dark:text-slate-100">{t("messages.welcome")}</p>
          <p className="mt-1 text-slate-500 dark:text-slate-300">{t("pages.home.focus")}</p>
        </div>
      ) : null}
    </motion.aside>
  );
};

export default Sidebar;
