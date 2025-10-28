import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTaskContext } from "../context/TaskContext";
import type { Task, TaskInput, TaskPriority } from "../hooks/useTasks";

export interface AddTaskModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  task?: Task | null;
  onClose: () => void;
}

const defaultValues: TaskInput = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: new Date().toISOString().split("T")[0]
};

export const AddTaskModal = ({ isOpen, mode, task, onClose }: AddTaskModalProps) => {
  const { addTask, updateTask, columns } = useTaskContext();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskInput>({
    defaultValues
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.split("T")[0]
      });
    } else {
      reset(defaultValues);
    }
  }, [task, reset]);

  const onSubmit = (data: TaskInput) => {
    const normalized: TaskInput = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString()
    };

    if (mode === "edit" && task) {
      updateTask(task.id, normalized);
    } else {
      addTask(normalized);
    }

    onClose();
  };

  const priorityOptions: TaskPriority[] = ["low", "medium", "high"];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="glass-panel w-full max-w-xl rounded-3xl p-6 shadow-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dialog.Title className="mb-2 text-2xl font-semibold text-surface-dark dark:text-surface-light">
                    {mode === "edit" ? t("modal.editTitle") : t("modal.addTitle")}
                  </Dialog.Title>
                  <Dialog.Description className="mb-6 text-sm text-slate-500 dark:text-slate-300">
                    {t("messages.welcome")}
                  </Dialog.Description>

                  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <label className="mb-1 block text-sm font-medium">{t("labels.title")}</label>
                      <input
                        {...register("title", { required: true })}
                        className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none transition focus:border-accent-light focus:ring-2 focus:ring-accent-light/50 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:border-accent-dark"
                        placeholder={t("labels.title")}
                      />
                      {errors.title ? (
                        <span className="mt-1 block text-xs text-rose-500">{t("labels.title")} *</span>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">{t("labels.description")}</label>
                      <textarea
                        {...register("description", { required: true })}
                        className="h-28 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none transition focus:border-accent-light focus:ring-2 focus:ring-accent-light/50 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:border-accent-dark"
                        placeholder={t("labels.description")}
                      />
                      {errors.description ? (
                        <span className="mt-1 block text-xs text-rose-500">{t("labels.description")} *</span>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="relative">
                        <label className="mb-1 block text-sm font-medium">{t("labels.priority")}</label>
                        <select
                          {...register("priority", { required: true })}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 p-3 pr-10 text-sm outline-none transition focus:border-accent-light focus:ring-2 focus:ring-accent-light/40 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:border-accent-dark"
                        >
                          {priorityOptions.map((priority) => (
                            <option key={priority} value={priority}>
                              {t(`labels.priorityLevels.${priority}`)}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute bottom-3 right-4 text-slate-400 dark:text-slate-500">
                          ▾
                        </span>
                      </div>

                      <div className="relative">
                        <label className="mb-1 block text-sm font-medium">{t("labels.dueDate")}</label>
                        <input
                          type="date"
                          {...register("dueDate", { required: true })}
                          className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none transition focus:border-accent-light focus:ring-2 focus:ring-accent-light/40 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:border-accent-dark"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="mb-1 block text-sm font-medium">{t("labels.status")}</label>
                      <select
                        {...register("status", { required: true })}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 p-3 pr-10 text-sm outline-none transition focus:border-accent-light focus:ring-2 focus:ring-accent-light/40 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:border-accent-dark"
                      >
                        {columns.map((column) => (
                          <option key={column.id} value={column.id}>
                            {t(column.translationKey)}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute bottom-3 right-4 text-slate-400 dark:text-slate-500">
                        ▾
                      </span>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100/80 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/60"
                      >
                        {t("buttons.cancel")}
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-accent-light px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-light/30 transition hover:bg-accent-light/90 dark:bg-accent-dark dark:shadow-accent-dark/30"
                      >
                        {mode === "edit" ? t("buttons.save") : t("buttons.add")}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTaskModal;
