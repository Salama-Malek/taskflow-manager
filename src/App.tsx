import { Fragment, lazy, useMemo, useState } from "react";
import { Route, Routes, useLocation, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import { useTaskContext } from "./context/TaskContext";
import type { Task } from "./hooks/useTasks";
import { useTranslation } from "react-i18next";
import { XMarkIcon, HomeModernIcon, ChartBarIcon, Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const HomePage = lazy(() => import("./pages/Home"));
const AboutPage = lazy(() => import("./pages/About"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const StatisticsPage = lazy(() => import("./pages/Statistics"));
const AddTaskModal = lazy(() => import("./components/AddTaskModal"));

type ModalState =
  | {
      mode: "create";
      task: null;
    }
  | {
      mode: "edit";
      task: Task;
    }
  | {
      mode: null;
      task: null;
    };

const App = () => {
  const location = useLocation();
  const { toasts, dismissToast, showToast } = useTaskContext();
  const { t } = useTranslation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({ mode: null, task: null });
  const [aboutOpen, setAboutOpen] = useState(false);

  const openCreateModal = () => setModalState({ mode: "create", task: null });
  const openEditModal = (task: Task) => setModalState({ mode: "edit", task });
  const closeModal = () => setModalState({ mode: null, task: null });

  const navigation = useMemo(
    () => [
      { to: "/", label: t("navigation.home"), icon: HomeModernIcon },
      { to: "/statistics", label: t("navigation.statistics"), icon: ChartBarIcon },
      { to: "/settings", label: t("navigation.settings"), icon: Cog6ToothIcon },
      { to: "/about", label: t("navigation.about"), icon: UserCircleIcon }
    ],
    [t]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background-light transition-colors duration-500 dark:bg-background-dark">
      <Sidebar
        isOpen={!sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        onShowAbout={() => setAboutOpen(true)}
      />

      <AnimatePresence>
        {mobileSidebarOpen ? (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white/90 p-6 shadow-2xl shadow-slate-900/40 backdrop-blur-xl dark:bg-slate-900/90 md:hidden"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("app.title")}</h2>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-full border border-slate-200/60 p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700/60 dark:text-slate-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-accent-light/20 text-accent-light dark:bg-accent-dark/20 dark:text-accent-dark"
                        : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-200 dark:hover:bg-slate-700/50"
                    ].join(" ")
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {mobileSidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      ) : null}

      <div className="flex flex-1 min-h-0 flex-col">
        <Header
          onAddTask={openCreateModal}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto bg-transparent px-4 pb-10 pt-6 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="min-h-[60vh]"
            >
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={<HomePage onAddTask={openCreateModal} onEditTask={openEditModal} isCompact={sidebarCollapsed} />}
                />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      <AnimatePresence>
        {modalState.mode ? (
          <AddTaskModal
            key="taskflow-modal"
            isOpen
            mode={modalState.mode}
            task={modalState.task ?? undefined}
            onClose={closeModal}
          />
        ) : null}
      </AnimatePresence>

      <Transition show={aboutOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setAboutOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="glass-panel w-full max-w-lg rounded-3xl p-8">
                <Dialog.Title className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {t("modal.aboutTitle")}
                </Dialog.Title>
                <Dialog.Description className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {t("modal.aboutDescription")}
                </Dialog.Description>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setAboutOpen(false)}
                    className="rounded-xl bg-accent-light px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-light/40 transition hover:bg-accent-light/90 dark:bg-accent-dark dark:shadow-accent-dark/30"
                  >
                    {t("buttons.close")}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default App;
