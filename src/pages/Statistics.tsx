import { useMemo } from "react";
import { format, differenceInCalendarDays, isBefore, parseISO, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTaskContext } from "../context/TaskContext";
import type { Task, TaskPriority, TaskStatus } from "../hooks/useTasks";

const priorityBgColors: Record<TaskPriority, string> = {
  low: "bg-emerald-400",
  medium: "bg-amber-400",
  high: "bg-rose-500"
};

const priorityOrder: TaskPriority[] = ["high", "medium", "low"];

const Statistics = () => {
  const { tasks, columns } = useTaskContext();
  const { t, i18n } = useTranslation();

  const now = new Date();

  const {
    totalTasks,
    completedTasks,
    completionRate,
    dueSoon,
    overdue,
    statusStats,
    priorityStats,
    upcomingDeadlines,
    weeklyVelocity
  } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "done").length;
    const completion = total === 0 ? 0 : Math.round((completed / total) * 100);
    const soon = tasks.filter((task) => {
      const due = parseISO(task.dueDate);
      const diff = differenceInCalendarDays(due, now);
      return task.status !== "done" && diff >= 0 && diff <= 7;
    }).length;
    const overdueCount = tasks.filter((task) => {
      const due = parseISO(task.dueDate);
      return task.status !== "done" && isBefore(due, now);
    }).length;

    const statusDistribution = columns.map((column) => ({
      id: column.id,
      label: column.translationKey,
      total: tasks.filter((task) => task.status === column.id).length
    }));

    const priorityDistribution = priorityOrder.map((priority) => ({
      id: priority,
      total: tasks.filter((task) => task.priority === priority).length
    }));

    const upcoming = [...tasks]
      .filter((task) => task.status !== "done")
      .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
      .slice(0, 5);

    const weeks = Array.from({ length: 6 }).map((_, index) => {
      const start = startOfWeek(subWeeks(now, 5 - index), { weekStartsOn: 1 });
      const end = endOfWeek(start, { weekStartsOn: 1 });
      const count = tasks.filter((task) => {
        const created = parseISO(task.createdAt);
        return created >= start && created <= end;
      }).length;

      return {
        label: format(start, "MMM d"),
        count
      };
    });

    return {
      totalTasks: total,
      completedTasks: completed,
      completionRate: completion,
      dueSoon: soon,
      overdue: overdueCount,
      statusStats: statusDistribution,
      priorityStats: priorityDistribution,
      upcomingDeadlines: upcoming,
      weeklyVelocity: weeks
    };
  }, [tasks, columns, now]);

  const totalPriority = priorityStats.reduce((sum, item) => sum + item.total, 0);

  const donutGradient =
    totalPriority === 0
      ? "conic-gradient(#e2e8f0 0deg 360deg)"
      : (() => {
          let currentAngle = 0;
          const segments: string[] = [];
          priorityOrder.forEach((priority) => {
            const stat = priorityStats.find((item) => item.id === priority);
            if (!stat || stat.total === 0) {
              return;
            }
            const angle = (stat.total / totalPriority) * 360;
            const start = currentAngle;
            const end = currentAngle + angle;
            currentAngle = end;
            const color =
              priority === "high"
                ? "#f43f5e"
                : priority === "medium"
                  ? "#f59e0b"
                  : "#10b981";
            segments.push(`${color} ${start}deg ${end}deg`);
          });
          return `conic-gradient(${segments.join(", ")})`;
        })();

  const maxWeeklyCount = Math.max(...weeklyVelocity.map((item) => item.count), 1);

  const locale = i18n.language === "ar" ? "ar-EG" : i18n.language === "ru" ? "ru-RU" : "en-US";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-3xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t("statisticsPage.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-300">{t("statisticsPage.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: t("statisticsPage.cards.total"),
            value: totalTasks,
            accent: "from-sky-500 to-indigo-500"
          },
          {
            label: t("statisticsPage.cards.completed"),
            value: `${completedTasks} · ${completionRate}%`,
            accent: "from-emerald-500 to-teal-500"
          },
          {
            label: t("statisticsPage.cards.dueSoon"),
            value: dueSoon,
            accent: "from-amber-500 to-orange-500"
          },
          {
            label: t("statisticsPage.cards.overdue"),
            value: overdue,
            accent: "from-rose-500 to-pink-500"
          }
        ].map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ translateY: -4 }}
            className="relative overflow-hidden rounded-3xl bg-white/80 p-5 shadow-lg shadow-slate-200/50 ring-1 ring-white/50 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-slate-900/40 dark:ring-slate-800/60"
          >
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.accent} opacity-20`}
            />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          layout
          className="space-y-4 rounded-3xl bg-white/85 p-6 shadow-lg shadow-slate-200/50 ring-1 ring-white/40 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-slate-900/40 dark:ring-slate-800/60 xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("statisticsPage.sections.progress")}
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {completionRate}% {t("statisticsPage.labels.completion")}
            </span>
          </div>
          <div className="space-y-4">
            {statusStats.map((status) => {
              const label = t(status.label);
              const percent = totalTasks === 0 ? 0 : Math.round((status.total / totalTasks) * 100);
              return (
                <div key={status.id}>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                    <span>{label}</span>
                    <span>
                      {status.total} · {percent}%
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-accent-light to-blue-400 dark:from-accent-dark dark:to-sky-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          layout
          className="space-y-5 rounded-3xl bg-white/85 p-6 shadow-lg shadow-slate-200/50 ring-1 ring-white/40 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-slate-900/40 dark:ring-slate-800/60"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t("statisticsPage.sections.priority")}
          </h2>
          <div className="flex items-center justify-between gap-6">
            <div
              className="h-36 w-36 rounded-full border-4 border-white/60 shadow-lg shadow-slate-200/60 dark:border-slate-800/80"
              style={{ backgroundImage: donutGradient }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white/80 text-center text-sm font-semibold text-slate-700 shadow-inner shadow-white/40 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-slate-900/40">
                {totalPriority === 0 ? t("statisticsPage.labels.noData") : `${completionRate}%`}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {priorityOrder.map((priority) => {
                const stat = priorityStats.find((item) => item.id === priority);
                const count = stat?.total ?? 0;
                const percentage = totalPriority === 0 ? 0 : Math.round((count / totalPriority) * 100);
                return (
                  <div key={priority} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${priorityBgColors[priority]}`} />
                      <span className="font-medium text-slate-600 capitalize dark:text-slate-200">
                        {t(`labels.priorityLevels.${priority}`)}
                      </span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-300">
                      {count} · {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          layout
          className="space-y-5 rounded-3xl bg-white/85 p-6 shadow-lg shadow-slate-200/50 ring-1 ring-white/40 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-slate-900/40 dark:ring-slate-800/60"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("statisticsPage.sections.velocity")}
            </h2>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-300">
              {t("statisticsPage.labels.lastWeeks", { count: weeklyVelocity.length })}
            </span>
          </div>
          <div className="flex h-48 items-end gap-3">
            {weeklyVelocity.map((week) => (
              <div key={week.label} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(week.count / maxWeeklyCount) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-2xl bg-gradient-to-t from-slate-200 to-accent-light/80 shadow-lg dark:from-slate-800 dark:to-accent-dark/70"
                />
                <span className="text-xs font-medium text-slate-400 dark:text-slate-400">{week.label}</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">{week.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="space-y-5 rounded-3xl bg-white/85 p-6 shadow-lg shadow-slate-200/50 ring-1 ring-white/40 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-slate-900/40 dark:ring-slate-800/60"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t("statisticsPage.sections.upcoming")}
          </h2>
          <div className="space-y-4">
            {upcomingDeadlines.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200/70 p-6 text-center text-sm text-slate-400 dark:border-slate-700/70 dark:text-slate-500">
                {t("statisticsPage.labels.noUpcoming")}
              </p>
            ) : (
              upcomingDeadlines.map((task) => {
                const dueDate = new Date(task.dueDate);
                const diff = differenceInCalendarDays(dueDate, now);
                const statusColor =
                  task.priority === "high"
                    ? "bg-rose-500/15 text-rose-500"
                    : task.priority === "medium"
                      ? "bg-amber-500/15 text-amber-500"
                      : "bg-emerald-500/15 text-emerald-500";
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100/70 bg-white/80 px-4 py-3 shadow-sm shadow-slate-200/50 dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-slate-900/40"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-400">
                        {task.description.slice(0, 72)}
                        {task.description.length > 72 ? "..." : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
                        {t(`labels.priorityLevels.${task.priority}`)}
                      </span>
                      <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-300">
                        {diff < 0
                          ? t("statisticsPage.labels.overdue", { count: Math.abs(diff) })
                          : diff === 0
                            ? t("statisticsPage.labels.dueToday")
                            : t("statisticsPage.labels.dueIn", { count: diff })}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {dueDate.toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Statistics;
