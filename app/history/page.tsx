"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Circle,
  Flame,
  Loader2,
} from "lucide-react";

import Calendar from "@/components/calendar";

type Completion = {
  id: string;
  date: string;
  completed: boolean;
};

type Habit = {
  id: string;
  name: string;
  emoji: string | null;
  frequency: string;
  active: boolean;
  completions?: Completion[];
};

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
}

function formatMonthDay(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

function isToday(date: Date) {
  const today = new Date();

  return (
    getDateKey(date) ===
    getDateKey(today)
  );
}

function isYesterday(date: Date) {
  const yesterday = new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  return (
    getDateKey(date) ===
    getDateKey(yesterday)
  );
}

export default function HistoryPage() {
  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [selectedDate, setSelectedDate] =
    useState<Date>(new Date());

  const [loading, setLoading] =
    useState(true);

  /*
   * FETCH
   */
  async function fetchHabits(
    showLoading = false
  ) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await fetch(
        "/api/habits",
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch habits"
        );
      }

      const data =
        await response.json();

      setHabits(
        Array.isArray(data)
          ? data.map((habit) => ({
              ...habit,
              completions:
                habit.completions ?? [],
            }))
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch history:",
        error
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  /*
   * REALTIME
   */
  useEffect(() => {
    let mounted = true;

    async function refresh(
      showLoading = false
    ) {
      if (!mounted) return;

      await fetchHabits(showLoading);
    }

    refresh(true);

    const interval = setInterval(
      () => refresh(false),
      5000
    );

    function handleVisibility() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        refresh(false);
      }
    }

    function handleFocus() {
      refresh(false);
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      mounted = false;

      clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  /*
   * GROUP HISTORY
   */
  const historyGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        date: Date;
        habits: {
          id: string;
          name: string;
          emoji: string | null;
          completed: boolean;
        }[];
      }
    >();

    habits.forEach((habit) => {
      (habit.completions ?? []).forEach(
        (completion) => {
          const date = new Date(
            completion.date
          );

          const key = getDateKey(date);

          if (!groups.has(key)) {
            groups.set(key, {
              date,
              habits: [],
            });
          }

          groups
            .get(key)!
            .habits.push({
              id: `${habit.id}-${completion.id}`,
              name: habit.name,
              emoji: habit.emoji,
              completed:
                completion.completed,
            });
        }
      );
    });

    return Array.from(groups.values())
      .sort(
        (a, b) =>
          b.date.getTime() -
          a.date.getTime()
      )
      .map((group) => ({
        ...group,
        habits: group.habits.sort(
          (a, b) =>
            Number(b.completed) -
            Number(a.completed)
        ),
      }));
  }, [habits]);

  /*
   * SELECTED GROUP
   */
  const selectedGroup =
    useMemo(() => {
      const key =
        getDateKey(selectedDate);

      return historyGroups.find(
        (group) =>
          getDateKey(group.date) === key
      );
    }, [
      historyGroups,
      selectedDate,
    ]);

  /*
   * SELECT DATE
   */
  function handleSelectDate(
    date: Date
  ) {
    setSelectedDate(date);

    setTimeout(() => {
      document
        .getElementById(
          `history-${getDateKey(date)}`
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  }

  /*
   * SUMMARY
   */
  const totalCompletions =
    habits.reduce(
      (total, habit) =>
        total +
        (habit.completions ?? []).filter(
          (completion) =>
            completion.completed
        ).length,
      0
    );

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <section className="min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Your journey
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-[-0.035em]">
                History
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Your habit activity over time.
              </p>
            </div>

            {/* MINI SUMMARY */}
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-300">
                  Habits
                </p>

                <p className="mt-0.5 text-sm font-bold">
                  {habits.length}
                </p>
              </div>

              <div className="h-7 w-px bg-gray-100" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-300">
                  Completed
                </p>

                <p className="mt-0.5 text-sm font-bold">
                  {totalCompletions}
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-7 grid items-start gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
            {/* CALENDAR */}
            <div className="lg:sticky lg:top-6">
              <Calendar
                habits={habits}
                selectedDate={selectedDate}
                onSelectDate={
                  handleSelectDate
                }
              />
            </div>

            {/* TIMELINE */}
            <div className="min-w-0">
              {loading ? (
                <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
                  <Loader2
                    size={20}
                    className="animate-spin text-gray-300"
                  />
                </div>
              ) : historyGroups.length ===
                0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <Flame
                      size={18}
                      className="text-gray-400"
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    No activity yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Complete a habit and
                    your history will
                    appear here.
                  </p>
                </div>
              ) : (
                <>
                  {/* TOP TITLE */}
                  <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-300">
                        Activity timeline
                      </p>

                      <h2 className="mt-1 text-lg font-bold">
                        {selectedGroup
                          ? formatFullDate(
                              selectedGroup.date
                            )
                          : "Your activity"}
                      </h2>
                    </div>

                    <p className="text-[10px] text-gray-400">
                      {historyGroups.length}{" "}
                      active days
                    </p>
                  </div>

                  {/* TIMELINE */}
                  <div className="relative">
                    {/* VERTICAL LINE */}
                    <div className="absolute bottom-5 left-[7px] top-2 w-px bg-gray-200" />

                    <div className="space-y-8">
                      {historyGroups.map(
                        (group) => {
                          const completed =
                            group.habits.filter(
                              (habit) =>
                                habit.completed
                            ).length;

                          const total =
                            group.habits.length;

                          const percentage =
                            total > 0
                              ? Math.round(
                                  (completed /
                                    total) *
                                    100
                                )
                              : 0;

                          const selected =
                            getDateKey(
                              group.date
                            ) ===
                            getDateKey(
                              selectedDate
                            );

                          return (
                            <section
                              key={getDateKey(
                                group.date
                              )}
                              id={`history-${getDateKey(
                                group.date
                              )}`}
                              className="relative scroll-mt-6 pl-7"
                            >
                              {/* TIMELINE DOT */}
                              <span
                                className={`absolute left-0 top-1.5 z-10 h-4 w-4 rounded-full border-4 border-[#f7f8fa] ${
                                  selected
                                    ? "bg-black"
                                    : completed ===
                                        total
                                      ? "bg-gray-700"
                                      : "bg-gray-300"
                                }`}
                              />

                              {/* DATE HEADER */}
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold">
                                      {isToday(
                                        group.date
                                      )
                                        ? "Today"
                                        : isYesterday(
                                              group.date
                                            )
                                          ? "Yesterday"
                                          : formatFullDate(
                                              group.date
                                            )}
                                    </h3>

                                    {isToday(
                                      group.date
                                    ) && (
                                      <span className="rounded-full bg-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                                        Today
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 text-[10px] text-gray-400">
                                    {formatMonthDay(
                                      group.date
                                    )}
                                    {" · "}
                                    {completed} of{" "}
                                    {total} completed
                                  </p>
                                </div>

                                {/* PERCENTAGE */}
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                      className="h-full rounded-full bg-black transition-all duration-500"
                                      style={{
                                        width: `${percentage}%`,
                                      }}
                                    />
                                  </div>

                                  <span className="w-8 text-right text-[10px] font-semibold text-gray-500">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>

                              {/* HABITS */}
                              <div
                                className={`mt-3 overflow-hidden rounded-2xl border bg-white transition-all ${
                                  selected
                                    ? "border-gray-300 shadow-[0_4px_18px_rgba(0,0,0,0.04)]"
                                    : "border-gray-200"
                                }`}
                              >
                                {group.habits.map(
                                  (
                                    habit,
                                    index
                                  ) => (
                                    <div
                                      key={
                                        habit.id
                                      }
                                      className={`flex items-center gap-3 px-4 py-3 ${
                                        index !==
                                        group
                                          .habits
                                          .length -
                                          1
                                          ? "border-b border-gray-100"
                                          : ""
                                      }`}
                                    >
                                      {/* EMOJI */}
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-sm">
                                        {habit.emoji ||
                                          "🎯"}
                                      </span>

                                      {/* NAME */}
                                      <span
                                        className={`min-w-0 flex-1 truncate text-xs ${
                                          habit.completed
                                            ? "text-gray-400 line-through"
                                            : "font-medium text-gray-700"
                                        }`}
                                      >
                                        {
                                          habit.name
                                        }
                                      </span>

                                      {/* STATUS */}
                                      {habit.completed ? (
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
                                          <Check
                                            size={
                                              12
                                            }
                                            strokeWidth={
                                              2.5
                                            }
                                          />
                                        </span>
                                      ) : (
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-200">
                                          <Circle
                                            size={
                                              15
                                            }
                                          />
                                        </span>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </section>
                          );
                        }
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}