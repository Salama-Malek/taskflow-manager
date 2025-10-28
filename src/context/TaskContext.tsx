import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren
} from "react";
import { useTranslation } from "react-i18next";
import {
  useTasks,
  type Task,
  type TaskColumn,
  type TaskInput,
  type TaskPriority,
  type TaskStatus,
  type ColumnTaskMap
} from "../hooks/useTasks";
import { v4 as uuid } from "uuid";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export interface TaskContextValue {
  tasks: Task[];
  columns: TaskColumn[];
  groupedTasks: Record<TaskStatus, Task[]>;
  addTask: (task: TaskInput) => Task;
  updateTask: (id: string, updates: Partial<TaskInput>) => Task | null;
  deleteTask: (id: string) => Task | null;
  reorderBoard: (map: ColumnTaskMap) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priorityFilter: TaskPriority | "all";
  setPriorityFilter: (priority: TaskPriority | "all") => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider = ({ children }: PropsWithChildren) => {
  const {
    tasks,
    columns,
    addTask: baseAddTask,
    updateTask: baseUpdateTask,
    deleteTask: baseDeleteTask,
    reorderBoard,
    searchTerm,
    setSearchTerm,
    priorityFilter,
    setPriorityFilter,
    groupedTasks
  } = useTasks();
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timerId = timers.current[id];
    if (timerId && typeof window !== "undefined") {
      window.clearTimeout(timerId);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = uuid();
      setToasts((prev) => [...prev, { id, message, type }]);

      if (typeof window !== "undefined") {
        timers.current[id] = window.setTimeout(() => dismissToast(id), 3000);
      }
    },
    [dismissToast]
  );

  const addTask = useCallback(
    (task: TaskInput) => {
      const created = baseAddTask(task);
      showToast(t("messages.added"), "success");
      return created;
    },
    [baseAddTask, showToast, t]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<TaskInput>) => {
      const updated = baseUpdateTask(id, updates);
      if (updated) {
        showToast(t("messages.updated"), "info");
      }
      return updated;
    },
    [baseUpdateTask, showToast, t]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const deleted = baseDeleteTask(id);
      if (deleted) {
        showToast(t("messages.deleted"), "warning");
      }
      return deleted;
    },
    [baseDeleteTask, showToast, t]
  );

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      columns,
      groupedTasks,
      addTask,
      updateTask,
      deleteTask,
      reorderBoard,
      searchTerm,
      setSearchTerm,
      priorityFilter,
      setPriorityFilter,
      toasts,
      dismissToast,
      showToast
    }),
    [
      tasks,
      columns,
      groupedTasks,
      addTask,
      updateTask,
      deleteTask,
      reorderBoard,
      searchTerm,
      setSearchTerm,
      priorityFilter,
      setPriorityFilter,
      toasts,
      dismissToast,
      showToast
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }
  return context;
};
