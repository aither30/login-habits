"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HabitCard from "@/components/habit-card";
import ProgressCard from "@/components/progress-card";
import StreakCard from "@/components/streak-card";
import WeeklyChart from "@/components/weekly-chart";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Habit = {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  time: string | null;
  frequency: string;
  active: boolean;
  completions?: {
    id: string;
    date: string;
    completed: boolean;
  }[];
};

type EditingHabit = {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  time: string | null;
  frequency: string;
};

const emojis = [
  "🏃",
  "📚",
  "💧",
  "🧘",
  "💪",
  "🍎",
  "😴",
  "🧹",
  "💻",
  "✍️",
  "🎯",
  "🧠",
];

export default function DashboardPage() {
  const router = useRouter();

  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState<"create" | "edit">("create");

  const [creating, setCreating] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [emoji, setEmoji] =
    useState("🎯");

  const [time, setTime] =
    useState("");

  const [frequency, setFrequency] =
    useState("daily");

  const [editingHabit, setEditingHabit] =
    useState<EditingHabit | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

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
                habit.completions ?? [],
            }))
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch habits:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  function openCreateModal() {
    setModalMode("create");
    setEditingHabit(null);
    setError("");

    setName("");
    setDescription("");
    setEmoji("🎯");
    setTime("");
    setFrequency("daily");

    setShowModal(true);
  }

  function openEditModal(habit: {
    id: string;
    name: string;
    description: string | null;
    emoji: string | null;
    time: string | null;
  }) {
    const originalHabit = habits.find(
      (item) => item.id === habit.id
    );

    setModalMode("edit");

    setEditingHabit({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      emoji: habit.emoji,
      time: habit.time,
      frequency:
        originalHabit?.frequency ??
        "daily",
    });

    setName(habit.name);
    setDescription(
      habit.description ?? ""
    );
    setEmoji(
      habit.emoji ?? "🎯"
    );
    setTime(habit.time ?? "");
    setFrequency(
      originalHabit?.frequency ??
        "daily"
    );

    setError("");
    setShowModal(true);
  }

  function closeModal() {
    if (creating || editing) {
      return;
    }

    setShowModal(false);
    setError("");
    setEditingHabit(null);
  }

  async function createHabit() {
    if (!name.trim()) {
      setError(
        "Nama habit wajib diisi."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        "/api/habits",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
            emoji,
            time: time || null,
            frequency,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create habit"
        );
      }

      const newHabit: Habit = {
        ...data,
        completions:
          data.completions ?? [],
      };

      setHabits((current) => [
        ...current,
        newHabit,
      ]);

      setShowModal(false);

      setName("");
      setDescription("");
      setEmoji("🎯");
      setTime("");
      setFrequency("daily");
    } catch (error) {
      console.error(
        "Failed to create habit:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal membuat habit."
      );
    } finally {
      setCreating(false);
    }
  }

  async function updateHabit() {
    if (!editingHabit) {
      return;
    }

    if (!name.trim()) {
      setError(
        "Nama habit wajib diisi."
      );
      return;
    }

    try {
      setEditing(true);
      setError("");

      const response = await fetch(
        `/api/habits/${editingHabit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
            emoji,
            time: time || null,
            frequency,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update habit"
        );
      }

      setHabits((current) =>
        current.map((habit) =>
          habit.id ===
          editingHabit.id
            ? {
                ...habit,
                ...data,
                completions:
                  habit.completions ??
                  [],
              }
            : habit
        )
      );

      setShowModal(false);
      setEditingHabit(null);
    } catch (error) {
      console.error(
        "Failed to update habit:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah habit."
      );
    } finally {
      setEditing(false);
    }
  }

  function requestDelete(id: string) {
    setDeletingId(id);
  }

  async function deleteHabit() {
    if (!deletingId) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `/api/habits/${deletingId}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete habit"
        );
      }

      setHabits((current) =>
        current.filter(
          (habit) =>
            habit.id !== deletingId
        )
      );

      setDeletingId(null);
    } catch (error) {
      console.error(
        "Failed to delete habit:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus habit."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  const completedCount = useMemo(() => {
    const today = new Date();

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    return habits.filter((habit) =>
      (habit.completions ?? []).some(
        (completion) => {
          const completionDate =
            new Date(
              completion.date
            );

          const completionStart =
            new Date(
              completionDate.getFullYear(),
              completionDate.getMonth(),
              completionDate.getDate()
            ).getTime();

          return (
            completionStart ===
              todayStart &&
            completion.completed
          );
        }
      )
    ).length;
  }, [habits]);

  const completionPercentage =
    habits.length > 0
      ? Math.round(
          (completedCount /
            habits.length) *
            100
        )
      : 0;

  function handleCompletedChange(
    id: string,
    completed: boolean
  ) {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) {
          return habit;
        }

        const today = new Date();

        const todayStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        const existingCompletion =
          (
            habit.completions ?? []
          ).find((completion) => {
            const date =
              new Date(
                completion.date
              );

            return (
              date.getFullYear() ===
                todayStart.getFullYear() &&
              date.getMonth() ===
                todayStart.getMonth() &&
              date.getDate() ===
                todayStart.getDate()
            );
          });

        if (existingCompletion) {
          return {
            ...habit,
            completions: (
              habit.completions ?? []
            ).map(
              (completion) =>
                completion.id ===
                existingCompletion.id
                  ? {
                      ...completion,
                      completed,
                    }
                  : completion
            ),
          };
        }

        if (completed) {
          return {
            ...habit,
            completions: [
              ...(habit.completions ??
                []),
              {
                id: `temp-${Date.now()}`,
                date:
                  todayStart.toISOString(),
                completed: true,
              },
            ],
          };
        }

        return habit;
      })
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-gray-950">
      <section className="min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-8">

          {/* HEADER */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <CalendarDays size={14} />

                {new Date().toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                Good afternoon 👋
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Make today count. One habit
                at a time.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 sm:w-auto"
            >
              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              New Habit
            </button>
          </div>

          {/* SUMMARY */}
          <div className="mt-7 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ProgressCard
                completed={
                  completedCount
                }
                total={habits.length}
              />

              <StreakCard
                completions={habits.flatMap(
                  (habit) =>
                    habit.completions ??
                    []
                )}
              />
            </div>

            <WeeklyChart
              habits={habits}
            />
          </div>

          {/* HABITS */}
          <section className="mt-9">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Today's Habits
                  </h2>

                  <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                    {loading
                      ? "..."
                      : `${completedCount} / ${habits.length}`}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-gray-400 sm:text-sm">
                  Complete your habits and keep
                  your momentum going.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/habits")
                }
                className="group flex items-center gap-1 text-xs font-semibold text-gray-400 transition hover:text-black"
              >
                View all

                <ChevronRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {/* COMPLETION BAR */}
            <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                    <Check
                      size={16}
                      strokeWidth={2.5}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      Daily completion
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {loading
                        ? "Loading habits..."
                        : `${completedCount} of ${habits.length} habits completed`}
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold">
                  {completionPercentage}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-black transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* HABIT LIST */}
            {loading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-[88px] animate-pulse rounded-2xl border border-gray-200 bg-white"
                    />
                  )
                )}
              </div>
            ) : habits.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                  <Plus size={20} />
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  No habits yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-400">
                  Start building your routine by
                  creating your first habit.
                </p>

                <button
                  type="button"
                  onClick={
                    openCreateModal
                  }
                  className="mt-5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  Create your first habit
                </button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {habits.map((habit) => {
                  const today =
                    new Date();

                  const completedToday = (
                    habit.completions ??
                    []
                  ).some(
                    (completion) => {
                      const date =
                        new Date(
                          completion.date
                        );

                      return (
                        date.getFullYear() ===
                          today.getFullYear() &&
                        date.getMonth() ===
                          today.getMonth() &&
                        date.getDate() ===
                          today.getDate() &&
                        completion.completed
                      );
                    }
                  );

                  return (
                    <HabitCard
                      key={habit.id}
                      id={habit.id}
                      emoji={habit.emoji}
                      title={habit.name}
                      description={
                        habit.description
                      }
                      time={habit.time}
                      completed={
                        completedToday
                      }
                      onCompletedChange={
                        handleCompletedChange
                      }
                      onEdit={
                        openEditModal
                      }
                      onDelete={
                        requestDelete
                      }
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* QUICK ACTION */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Keep your streak alive
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {habits.length === 0
                  ? "Create your first habit to get started."
                  : `You have ${
                      habits.length -
                      completedCount
                    } habit${
                      habits.length -
                        completedCount !==
                      1
                        ? "s"
                        : ""
                    } left today.`}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/statistics"
                )
              }
              className="group flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-black"
            >
              See your streak

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </section>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-bold tracking-tight sm:text-lg">
                  {modalMode === "create"
                    ? "Create new habit"
                    : "Edit habit"}
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400 sm:text-xs">
                  {modalMode === "create"
                    ? "Build a routine that sticks."
                    : "Update your habit details."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={
                  creating || editing
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <div className="grid gap-4 md:grid-cols-2">

                {/* LEFT */}
                <div className="space-y-4">

                  {/* NAME */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Habit name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                            "Enter" &&
                          !creating &&
                          !editing
                        ) {
                          modalMode ===
                          "create"
                            ? createHabit()
                            : updateHabit();
                        }
                      }}
                      placeholder="e.g. Read 20 pages"
                      autoFocus
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Description
                      <span className="ml-1 font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Read before sleeping"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* TIME */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Time
                      <span className="ml-1 font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>

                    <div className="relative">
                      <Clock3
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="time"
                        value={time}
                        onChange={(event) =>
                          setTime(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-black focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-4">

                  {/* ICON */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Icon
                    </label>

                    <div className="grid grid-cols-6 gap-1.5">
                      {emojis.map(
                        (item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              setEmoji(
                                item
                              )
                            }
                            className={`flex h-9 items-center justify-center rounded-lg border text-base transition ${
                              emoji ===
                              item
                                ? "border-black bg-black"
                                : "border-gray-200 bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* FREQUENCY */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Frequency
                    </label>

                    <select
                      value={
                        frequency
                      }
                      onChange={(event) =>
                        setFrequency(
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-black focus:bg-white"
                    >
                      <option value="daily">
                        Every day
                      </option>

                      <option value="weekly">
                        Every week
                      </option>
                    </select>
                  </div>

                  {/* PREVIEW */}
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                      Preview
                    </p>

                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                        {emoji ||
                          "🎯"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {name.trim() ||
                            "Your habit"}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-gray-400">
                          {description.trim() ||
                            "Your habit description"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3.5 sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={
                  creating || editing
                }
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  modalMode ===
                  "create"
                    ? createHabit
                    : updateHabit
                }
                disabled={
                  creating || editing
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ||
                editing ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />

                    {modalMode ===
                    "create"
                      ? "Creating..."
                      : "Saving..."}
                  </>
                ) : (
                  <>
                    {modalMode ===
                    "create" ? (
                      <Plus size={14} />
                    ) : (
                      <Check
                        size={14}
                      />
                    )}

                    {modalMode ===
                    "create"
                      ? "Create Habit"
                      : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              Delete habit?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              This will permanently delete
              this habit and its completion
              history. This action cannot be
              undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingId(null)
                }
                disabled={
                  deleteLoading
                }
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:text-black disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteHabit}
                disabled={
                  deleteLoading
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}