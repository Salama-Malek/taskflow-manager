import { AnimatePresence, motion } from "framer-motion";
import type { ToastMessage } from "../context/TaskContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const toastVariants = {
  initial: { opacity: 0, x: 80, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 80, scale: 0.9 }
};

const accentByType: Record<ToastMessage["type"], string> = {
  success: "from-emerald-400 to-emerald-500",
  info: "from-sky-400 to-sky-500",
  warning: "from-amber-400 to-amber-500",
  error: "from-rose-500 to-rose-600"
};

const Toast = ({ toasts, onDismiss }: ToastProps) => (
  <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-80 flex-col gap-3">
    <AnimatePresence initial={false}>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          {...toastVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl bg-white/90 p-4 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-900/80 dark:ring-slate-700/60`}
        >
          <div className={`mt-1 h-2 w-16 rounded-full bg-gradient-to-r ${accentByType[toast.type]}`} />
          <div className="flex-1 text-sm text-slate-700 dark:text-slate-200">{toast.message}</div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="rounded-full p-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default Toast;
