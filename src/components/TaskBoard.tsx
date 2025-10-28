import { Fragment, useMemo, useState } from "react";
import { closestCorners, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import { useTaskContext } from "../context/TaskContext";
import type { ColumnTaskMap, Task, TaskStatus, PriorityFilter } from "../hooks/useTasks";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export interface TaskBoardProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  isCompact?: boolean;
}

const columnBadgeColor: Record<TaskStatus, string> = {
  todo: "bg-slate-900/80 dark:bg-slate-100/30",
  inProgress: "bg-sky-500/80 dark:bg-sky-400/40",
  done: "bg-emerald-500/80 dark:bg-emerald-400/40"
};

const TaskBoard = ({ onAddTask, onEditTask, isCompact = false }: TaskBoardProps) => {
  const { columns, groupedTasks, reorderBoard, priorityFilter, setPriorityFilter, deleteTask } = useTaskContext();
  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);

  const columnOrderMap = () =>
    ({
      todo: groupedTasks.todo.map((task) => task.id),
      inProgress: groupedTasks.inProgress.map((task) => task.id),
      done: groupedTasks.done.map((task) => task.id)
    }) as ColumnTaskMap;

  const findColumnByTaskId = (id: string): TaskStatus | null => {
    const entry = (Object.entries(groupedTasks) as [TaskStatus, Task[]][]).find(([, tasks]) =>
      tasks.some((task) => task.id === id)
    );
    return entry ? entry[0] : null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    if (activeTaskId === overId) {
      return;
    }

    const originColumn = findColumnByTaskId(activeTaskId);
    const overIsColumn = (columns.map((column) => column.id) as string[]).includes(overId);
    const destinationColumn = overIsColumn ? (overId as TaskStatus) : findColumnByTaskId(overId);

    if (!originColumn || !destinationColumn) {
      return;
    }

    const current = columnOrderMap();
    const originTasks = [...current[originColumn]];
    const destinationTasks =
      originColumn === destinationColumn ? originTasks : [...current[destinationColumn]];

    const oldIndex = originTasks.indexOf(activeTaskId);
    let newIndex: number;

    if (overIsColumn) {
      newIndex = originColumn === destinationColumn ? destinationTasks.length - 1 : destinationTasks.length;
      if (newIndex < 0) {
        newIndex = 0;
      }
    } else {
      newIndex = destinationTasks.indexOf(overId);
      if (newIndex === -1) {
        newIndex = destinationTasks.length;
      }
    }

    if (originColumn === destinationColumn) {
      const reordered = arrayMove(destinationTasks, oldIndex, newIndex);
      reorderBoard({
        ...current,
        [destinationColumn]: reordered
      });
    } else {
      const filteredOrigin = originTasks.filter((id) => id !== activeTaskId);
      const updatedDestination = [...destinationTasks];
      const alreadyInDestination = updatedDestination.includes(activeTaskId);

      if (alreadyInDestination) {
        updatedDestination.splice(updatedDestination.indexOf(activeTaskId), 1);
      }
      updatedDestination.splice(newIndex, 0, activeTaskId);

      reorderBoard({
        ...current,
        [originColumn]: filteredOrigin,
        [destinationColumn]: updatedDestination
      });
    }
  };

  const handleDelete = () => {
    if (confirmTask) {
      deleteTask(confirmTask.id);
      setConfirmTask(null);
    }
  };

  const filterOptions = useMemo(
    () => [
      { value: "all" as PriorityFilter, label: t("labels.all") },
      { value: "low" as PriorityFilter, label: t("labels.priorityLevels.low") },
      { value: "medium" as PriorityFilter, label: t("labels.priorityLevels.medium") },
      { value: "high" as PriorityFilter, label: t("labels.priorityLevels.high") }
    ],
    [t]
  );

  const selectedFilter = filterOptions.find((option) => option.value === priorityFilter) ?? filterOptions[0];

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/60 dark:shadow-slate-900/50 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("navigation.home")}</h2>
          {!isCompact ? (
            <div className="space-y-1 text-sm text-slate-500 dark:text-slate-300">
              <p>{t("messages.welcome")}</p>
              <p>{t("pages.home.focus")}</p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Listbox value={priorityFilter} onChange={setPriorityFilter}>
            <div className="relative">
              <Listbox.Button className="flex items-center gap-3 rounded-full bg-gradient-to-r from-white/95 via-white/80 to-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/40 ring-1 ring-white/30 transition hover:ring-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/50 dark:from-slate-800/80 dark:via-slate-800/70 dark:to-slate-900/70 dark:text-slate-100 dark:ring-slate-700/50 dark:hover:ring-slate-500/60 dark:focus-visible:ring-accent-dark/50">
                <FunnelIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>{selectedFilter.label}</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-300 dark:text-slate-500" />
              </Listbox.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Listbox.Options className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-2xl border border-slate-200/60 bg-white/95 p-2 text-sm shadow-2xl shadow-slate-900/20 backdrop-blur-xl focus:outline-none dark:border-slate-700/60 dark:bg-slate-900/90">
                  {filterOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        [
                          "flex w-full items-center gap-2 rounded-xl px-3 py-2 transition",
                          active || priorityFilter === option.value
                            ? "bg-accent-light/15 text-accent-light dark:bg-accent-dark/20 dark:text-accent-dark"
                            : "text-slate-600 dark:text-slate-200"
                        ].join(" ")
                      }
                    >
                      {option.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onAddTask}
            className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {t("buttons.add")}
          </motion.button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              columnId={column.id}
              title={t(column.translationKey)}
              badgeColor={columnBadgeColor[column.id]}
              tasks={groupedTasks[column.id]}
              emptyLabel={t("board.empty")}
            >
              {groupedTasks[column.id].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(item) => onEditTask(item)}
                  onDelete={(item) => setConfirmTask(item)}
                />
              ))}
            </TaskColumn>
          ))}
        </div>
      </DndContext>

      <Transition show={!!confirmTask} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setConfirmTask(null)}>
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
              <Dialog.Panel className="glass-panel w-full max-w-md rounded-3xl p-6">
                <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {t("modal.confirmDelete")}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                  {confirmTask?.title}
                </Dialog.Description>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmTask(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
                  >
                    {t("buttons.cancel")}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600"
                  >
                    {t("buttons.delete")}
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

export default TaskBoard;
