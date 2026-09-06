"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  Flame,
  Loader2,
  Target,
} from "lucide-react";

import WeeklyChart from "@/components/weekly-chart";

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

function getStartOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function getDayOffset(offset: number) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  date.setDate(
    date.getDate() - offset
  );

  return getDateKey(date);
}

function calculateBestStreak(
  habits: Habit[]
) {
  const completedDates = new Set<string>();

  habits.forEach((habit) => {
    (
      habit.completions ?? []
    ).forEach((completion) => {
      if (!completion.completed) {
        return;
      }

      completedDates.add(
        getDateKey(
          new Date(completion.date)
        )
      );
    });
  });

  const sortedDates = Array.from(
    completedDates
  )
    .map(
      (date) =>
        new Date(`${date}T00:00:00`)
    )
    .sort(
      (a, b) =>
        a.getTime() - b.getTime()
    );

  let bestStreak = 0;
  let runningStreak = 0;
  let previousDate: Date | null =
    null;

  for (const date of sortedDates) {
    if (!previousDate) {
      runningStreak = 1;
    } else {
      const difference =
        Math.round(
          (date.getTime() -
            previousDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

      if (difference === 1) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    }

    bestStreak = Math.max(
      bestStreak,
      runningStreak
    );

    previousDate = date;
  }

  return bestStreak;
}

export default function StatisticsPage() {
  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchHabits() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/habits",
          {
            cache: "no-store",
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
                  habit.completions ??
                  [],
              }))
            : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch statistics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  const totalHabits =
    habits.length;

  /*
   * TOTAL COMPLETIONS
   * -----------------
   * Semua completion yang
   * pernah dilakukan.
   */
  const totalCompleted =
    useMemo(() => {
      return habits.reduce(
        (total, habit) =>
          total +
          (
            habit.completions ?? []
          ).filter(
            (completion) =>
              completion.completed
          ).length,
        0
      );
    }, [habits]);

  /*
   * COMPLETION RATE
   * ----------------
   * 7 hari terakhir.
   */
  const completionRate =
    useMemo(() => {
      if (habits.length === 0) {
        return 0;
      }

      const possible =
        habits.length * 7;

      const validDates = new Set(
        Array.from(
          { length: 7 },
          (_, index) =>
            getDayOffset(index)
        )
      );

      let completed = 0;

      habits.forEach((habit) => {
        (
          habit.completions ?? []
        ).forEach((completion) => {
          if (
            !completion.completed
          ) {
            return;
          }

          const dateKey =
            getDateKey(
              new Date(
                completion.date
              )
            );

          if (
            validDates.has(
              dateKey
            )
          ) {
            completed++;
          }
        });
      });

      return Math.min(
        100,
        Math.round(
          (completed / possible) *
            100
        )
      );
    }, [habits]);

  /*
   * BEST STREAK
   */
  const bestStreak =
    useMemo(
      () =>
        calculateBestStreak(
          habits
        ),
      [habits]
    );

  /*
   * PERFORMANCE PER HABIT
   * ----------------------
   * Dihitung berdasarkan
   * 7 hari terakhir.
   */
  const habitPerformance =
    useMemo(() => {
      const validDates = new Set(
        Array.from(
          { length: 7 },
          (_, index) =>
            getDayOffset(index)
        )
      );

      return habits
        .map((habit) => {
          const completedDates =
            new Set<string>();

          (
            habit.completions ?? []
          ).forEach((completion) => {
            if (
              !completion.completed
            ) {
              return;
            }

            const dateKey =
              getDateKey(
                new Date(
                  completion.date
                )
              );

            if (
              validDates.has(
                dateKey
              )
            ) {
              completedDates.add(
                dateKey
              );
            }
          });

          const completedCount =
            completedDates.size;

          const percentage =
            Math.min(
              100,
              Math.round(
                (completedCount /
                  7) *
                  100
              )
            );

          return {
            ...habit,
            completedCount,
            percentage,
          };
        })
        .sort(
          (a, b) =>
            b.percentage -
            a.percentage
        );
    }, [habits]);

  const today = getStartOfDay(
    new Date()
  );

  const todayKey =
    getDateKey(today);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-gray-950">
      <section className="min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-8">

          {/* HEADER */}
          <div>
            <p className="text-xs font-medium text-gray-400">
              Overview
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
              Statistics
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Understand your consistency
              and progress.
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* COMPLETION RATE */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Target size={18} />
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  7 days
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {loading
                  ? "..."
                  : `${completionRate}%`}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Completion Rate
              </p>
            </div>

            {/* COMPLETED */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Check size={18} />
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  All time
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {loading
                  ? "..."
                  : totalCompleted}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Habits Completed
              </p>
            </div>

            {/* BEST STREAK */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Flame size={18} />
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  Best
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {loading
                  ? "..."
                  : bestStreak}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Best Streak
              </p>
            </div>

            {/* TOTAL HABITS */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <BarChart3 size={18} />
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  Active
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {loading
                  ? "..."
                  : totalHabits}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Total Habits
              </p>
            </div>
          </div>

          {/* CHART + PERFORMANCE */}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            {/* WEEKLY CHART */}
            <WeeklyChart
              habits={habits}
            />

            {/* HABIT PERFORMANCE */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">
                    Habit Performance
                  </h2>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Last 7 days
                  </p>
                </div>

                <BarChart3
                  size={18}
                  className="text-gray-400"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2
                    size={20}
                    className="animate-spin text-gray-400"
                  />
                </div>
              ) : habitPerformance.length ===
                0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold">
                    No habits yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Create a habit to see
                    its performance.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {habitPerformance.map(
                    (habit) => (
                      <div
                        key={
                          habit.id
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="text-base">
                              {habit.emoji ||
                                "🎯"}
                            </span>

                            <span className="truncate text-xs font-medium">
                              {
                                habit.name
                              }
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-semibold">
                            {
                              habit.percentage
                            }%
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-black transition-all duration-500"
                            style={{
                              width: `${habit.percentage}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {
                            habit.completedCount
                          }{" "}
                          of 7 days completed
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* WEEK SUMMARY */}
          {!loading &&
            habits.length > 0 && (
              <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Weekly Summary
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      {completionRate >=
                      80
                        ? "Excellent consistency! 🔥"
                        : completionRate >=
                            50
                          ? "You're building momentum. 💪"
                          : "Keep showing up. 🚀"}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Your habits are
                      {completionRate >=
                      80
                        ? " looking very consistent this week."
                        : " improving one day at a time."}
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-2xl font-bold">
                        {
                          completionRate
                        }%
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Completion
                      </p>
                    </div>

                    <div>
                      <p className="text-2xl font-bold">
                        {
                          bestStreak
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Best streak
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}