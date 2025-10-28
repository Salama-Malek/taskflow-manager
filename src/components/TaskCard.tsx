import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../hooks/useTasks";

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const badgeColor = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200"
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };

  const formattedDate = useMemo(() => {
    try {
      return format(new Date(task.dueDate), "PPP");
    } catch {
      return task.dueDate;
    }
  }, [task.dueDate]);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      whileHover={{ y: -3 }}
      {...attributes}
      {...listeners}
      className="group flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-white/80 p-4 text-sm shadow-lg shadow-slate-200/50 transition hover:border-accent-light/60 hover:shadow-xl hover:shadow-accent-light/20 dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{task.title}</h3>
          <p className="mt-1 max-h-20 overflow-hidden text-xs text-slate-500 dark:text-slate-300">{task.description}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeColor[task.priority]}`}
        >
          {t(`labels.priorityLevels.${task.priority}`)}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
        <div>
          <p className="font-medium">{t("labels.dueDate")}</p>
          <p>{formattedDate}</p>
        </div>

        <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            type="button"
            className="rounded-full border border-slate-200/70 p-2 text-slate-600 transition hover:border-accent-light/60 hover:text-accent-light dark:border-slate-700/60 dark:text-slate-300 dark:hover:border-accent-dark/60 dark:hover:text-accent-dark"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            type="button"
            className="rounded-full border border-slate-200/70 p-2 text-slate-600 transition hover:border-rose-300 hover:text-rose-500 dark:border-slate-700/60 dark:text-slate-300 dark:hover:border-rose-400/70 dark:hover:text-rose-300"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
