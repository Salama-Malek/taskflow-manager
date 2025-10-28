import { useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuid } from "uuid";

export type TaskStatus = "todo" | "inProgress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface TaskColumn {
  id: TaskStatus;
  translationKey: string;
}

export type PriorityFilter = TaskPriority | "all";

const defaultTasks: Task[] = [
  {
    id: uuid(),
    title: "Plan sprint backlog",
    description: "Outline key deliverables and assign owners for the upcoming sprint.",
    priority: "high",
    status: "todo",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuid(),
    title: "Design dashboard mockups",
    description: "Ensure mobile responsiveness and finalize typography scale.",
    priority: "medium",
    status: "inProgress",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuid(),
    title: "Team retrospective notes",
    description: "Compile feedback from the team and highlight key action items.",
    priority: "low",
    status: "done",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const defaultColumns: TaskColumn[] = [
  { id: "todo", translationKey: "board.toDo" },
  { id: "inProgress", translationKey: "board.inProgress" },
  { id: "done", translationKey: "board.done" }
];

export type ColumnTaskMap = Record<TaskStatus, string[]>;

export interface UseTasksResult {
  tasks: Task[];
  columns: TaskColumn[];
  addTask: (task: TaskInput) => Task;
  updateTask: (id: string, task: Partial<TaskInput>) => Task | null;
  deleteTask: (id: string) => Task | null;
  reorderBoard: (map: ColumnTaskMap) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (priority: PriorityFilter) => void;
  groupedTasks: Record<TaskStatus, Task[]>;
}

export const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("taskflow-tasks", defaultTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const addTask = (task: TaskInput) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuid(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      order: Number.MAX_SAFE_INTEGER,
      createdAt: now,
      updatedAt: now
    };

    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<TaskInput>) => {
    let updatedTask: Task | null = null;
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const nextStatus = updates.status ?? task.status;
        updatedTask = {
          ...task,
          ...updates,
          status: nextStatus,
          order: nextStatus !== task.status ? Number.MAX_SAFE_INTEGER : task.order,
          updatedAt: new Date().toISOString()
        };
        return updatedTask;
      })
    );

    return updatedTask;
  };

  const deleteTask = (id: string) => {
    let removedTask: Task | null = null;
    setTasks((prev) =>
      prev.filter((task) => {
        if (task.id === id) {
          removedTask = task;
          return false;
        }
        return true;
      })
    );
    return removedTask;
  };

  const reorderBoard = (map: ColumnTaskMap) => {
    setTasks((prev) =>
      prev.map((task) => {
        const entry = (Object.entries(map) as [TaskStatus, string[]][]).find(([, ids]) => ids.includes(task.id));

        if (!entry) {
          return task;
        }

        const [status, ids] = entry;
        return {
          ...task,
          status,
          order: ids.indexOf(task.id)
        };
      })
    );
  };

  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch =
        term.length === 0 ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, priorityFilter]);

  const groupedTasks = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      inProgress: [],
      done: []
    };

    filteredTasks.forEach((task) => {
      map[task.status].push(task);
    });

    (Object.keys(map) as TaskStatus[]).forEach((status) => {
      map[status] = map[status].sort((a, b) => a.order - b.order);
    });

    return map;
  }, [filteredTasks]);

  return {
    tasks,
    columns: defaultColumns,
    addTask,
    updateTask,
    deleteTask,
    reorderBoard,
    searchTerm,
    setSearchTerm,
    priorityFilter,
    setPriorityFilter,
    groupedTasks
  };
};
