import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import type { Task, TaskStatus } from "../hooks/useTasks";

export interface TaskColumnProps {
  columnId: TaskStatus;
  title: string;
  badgeColor: string;
  tasks: Task[];
  children?: React.ReactNode;
  emptyLabel: string;
}

const TaskColumn = ({ columnId, title, badgeColor, tasks, emptyLabel, children }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId
  });

  return (
    <motion.section
      ref={setNodeRef}
      data-column={columnId}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex h-full min-h-[480px] flex-col rounded-3xl border border-slate-200/60 bg-slate-50/70 p-4 shadow-inner shadow-slate-200/40 transition dark:border-slate-700/60 dark:bg-slate-900/40 dark:shadow-slate-900/30 ${
        isOver ? "border-accent-light/60 dark:border-accent-dark/60" : ""
      }`}
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-200">
            {title}
          </h2>
          <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${badgeColor}`}>
            {tasks.length}
          </span>
        </div>
      </header>

      <SortableContext id={columnId} items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-2 pr-1">
          {tasks.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200/70 p-6 text-center text-xs text-slate-400 dark:border-slate-700/70 dark:text-slate-500">
              {emptyLabel}
            </p>
          ) : (
            children
          )}
        </div>
      </SortableContext>
    </motion.section>
  );
};

export default TaskColumn;
