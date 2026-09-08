"use client";

import { useEffect, useMemo, useState } from "react";
import HabitCard from "@/components/habit-card";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Completion = {
  id: string;
  date: string;
  completed: boolean;
};

type Habit = {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  time: string | null;
  frequency: string;
  active: boolean;
  completions?: Completion[];
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

function isCompletedToday(
  completions: Completion[] = []
) {
  const today = new Date();

  return completions.some((completion) => {
    if (!completion.completed) return false;

    const date = new Date(completion.date);

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });
}

export default function HabitsPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] =
    useState<"create" | "edit">("create");

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const [editingHabit, setEditingHabit] =
    useState<EditingHabit | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  /* =====================================================
     FETCH HABITS
  ===================================================== */

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await fetch("/api/habits", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      const data = await response.json();

      setHabits(
        Array.isArray(data)
          ? data.map((habit) => ({
              ...habit,
              completions: habit.completions ?? [],
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

  /* =====================================================
     SUMMARY
  ===================================================== */

  const completedCount = useMemo(() => {
    return habits.filter((habit) =>
      isCompletedToday(habit.completions)
    ).length;
  }, [habits]);

  const remainingCount = Math.max(
    0,
    habits.length - completedCount
  );

  const completionPercentage =
    habits.length > 0
      ? Math.round(
          (completedCount / habits.length) * 100
        )
      : 0;

  /* =====================================================
     FORM
  ===================================================== */

  function resetForm() {
    setName("");
    setDescription("");
    setEmoji("🎯");
    setTime("");
    setFrequency("daily");
    setError("");
  }

  function openCreateModal() {
    setModalMode("create");
    setEditingHabit(null);
    resetForm();
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
        originalHabit?.frequency ?? "daily",
    });

    setName(habit.name);
    setDescription(habit.description ?? "");
    setEmoji(habit.emoji ?? "🎯");
    setTime(habit.time ?? "");
    setFrequency(
      originalHabit?.frequency ?? "daily"
    );

    setError("");
    setShowModal(true);
  }

  function closeModal() {
    if (creating || editing) return;

    setShowModal(false);
    setEditingHabit(null);
    setError("");
  }

  /* =====================================================
     CREATE
  ===================================================== */

  async function createHabit() {
    if (!name.trim()) {
      setError("Nama habit wajib diisi.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          emoji,
          time: time || null,
          frequency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create habit"
        );
      }

      setHabits((current) => [
        ...current,
        {
          ...data,
          completions: data.completions ?? [],
        },
      ]);

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal membuat habit."
      );
    } finally {
      setCreating(false);
    }
  }

  /* =====================================================
     UPDATE
  ===================================================== */

  async function updateHabit() {
    if (!editingHabit) return;

    if (!name.trim()) {
      setError("Nama habit wajib diisi.");
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            emoji,
            time: time || null,
            frequency,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update habit"
        );
      }

      setHabits((current) =>
        current.map((habit) =>
          habit.id === editingHabit.id
            ? {
                ...habit,
                ...data,
                completions:
                  data.completions ??
                  habit.completions ??
                  [],
              }
            : habit
        )
      );

      setShowModal(false);
      setEditingHabit(null);
      resetForm();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah habit."
      );
    } finally {
      setEditing(false);
    }
  }

  /* =====================================================
     DELETE
  ===================================================== */

  function requestDelete(id: string) {
    setDeletingId(id);
  }

  async function deleteHabit() {
    if (!deletingId) return;

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `/api/habits/${deletingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete habit"
        );
      }

      setHabits((current) =>
        current.filter(
          (habit) => habit.id !== deletingId
        )
      );

      setDeletingId(null);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus habit."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  /* =====================================================
     COMPLETION
  ===================================================== */

  function handleCompletedChange(
    id: string,
    completed: boolean
  ) {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit;

        const today = new Date();

        const todayStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        const existingCompletion = (
          habit.completions ?? []
        ).find((completion) => {
          const date = new Date(completion.date);

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
            ).map((completion) =>
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
              ...(habit.completions ?? []),
              {
                id: `temp-${Date.now()}`,
                date: todayStart.toISOString(),
                completed: true,
              },
            ],
          };
        }

        return habit;
      })
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-gray-950">
      <section className="pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-8">

          {/* HEADER */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard")
                }
                className="mb-4 flex items-center gap-1 text-xs font-semibold text-gray-400 transition hover:text-black"
              >
                <ChevronLeft size={14} />
                Dashboard
              </button>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <CalendarDays size={14} />
                Your routine
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                All Habits
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your habits and keep your
                routine on track.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              New Habit
            </button>
          </div>

          {/* SUMMARY */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-black p-4 text-white">
              <p className="text-[10px] font-medium text-gray-400">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold">
                {loading ? "—" : habits.length}
              </p>

              <p className="mt-1 text-[10px] text-gray-500">
                habits
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] font-medium text-gray-400">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold">
                {loading ? "—" : completedCount}
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                today
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] font-medium text-gray-400">
                Remaining
              </p>

              <p className="mt-1 text-2xl font-bold">
                {loading ? "—" : remainingCount}
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                today
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] font-medium text-gray-400">
                Progress
              </p>

              <p className="mt-1 text-2xl font-bold">
                {loading
                  ? "—"
                  : `${completionPercentage}%`}
              </p>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-black transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* HABITS */}
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Your Habits
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Stay consistent, every day.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-500">
                {completedCount}/{habits.length}
              </span>
            </div>

            {loading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[88px] animate-pulse rounded-2xl border border-gray-200 bg-white"
                  />
                ))}
              </div>
            ) : habits.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                  <Plus size={20} />
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  No habits yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-400">
                  Create your first habit and start
                  building a better routine.
                </p>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  Create Habit
                </button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    id={habit.id}
                    emoji={habit.emoji}
                    title={habit.name}
                    description={habit.description}
                    time={habit.time}
                    completed={isCompletedToday(
                      habit.completions
                    )}
                    onCompletedChange={
                      handleCompletedChange
                    }
                    onEdit={openEditModal}
                    onDelete={requestDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !creating &&
              !editing
            ) {
              closeModal();
            }
          }}
        >
          <div className="flex max-h-[calc(100vh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:max-h-[calc(100vh-48px)]">

            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lg">
                  {emoji}
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    HabitFlow
                  </p>

                  <h2 className="mt-0.5 text-sm font-bold tracking-tight sm:text-base">
                    {modalMode === "create"
                      ? "Create new habit"
                      : "Edit habit"}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={creating || editing}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-black disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">

                {/* LEFT COLUMN */}
                <div className="space-y-4">

                  {/* NAME */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                      Habit name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="e.g. Read 20 pages"
                      autoFocus
                      disabled={creating || editing}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white disabled:opacity-50"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                      Description
                      <span className="ml-1 font-normal text-gray-400">
                        optional
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
                      rows={4}
                      disabled={creating || editing}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-xs leading-5 outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white disabled:opacity-50"
                    />
                  </div>

                  {/* TIME */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                      Reminder time
                      <span className="ml-1 font-normal text-gray-400">
                        optional
                      </span>
                    </label>

                    <input
                      type="time"
                      value={time}
                      onChange={(event) =>
                        setTime(event.target.value)
                      }
                      disabled={creating || editing}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs outline-none transition focus:border-black focus:bg-white disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">

                  {/* EMOJI */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                      Choose icon
                    </label>

                    <div className="grid grid-cols-6 gap-1.5">
                      {emojis.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setEmoji(item)
                          }
                          disabled={creating || editing}
                          className={`flex h-10 items-center justify-center rounded-xl border text-base transition ${
                            emoji === item
                              ? "border-black bg-black"
                              : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white"
                          } disabled:opacity-50`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FREQUENCY */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                      Frequency
                    </label>

                    <select
                      value={frequency}
                      onChange={(event) =>
                        setFrequency(event.target.value)
                      }
                      disabled={creating || editing}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs outline-none transition focus:border-black focus:bg-white disabled:opacity-50"
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
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
                      Preview
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        {emoji}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold">
                          {name.trim() ||
                            "Your habit"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-gray-400">
                          {description.trim() ||
                            "No description"}
                        </p>

                        <div className="mt-1.5 flex items-center gap-2 text-[9px] text-gray-400">
                          <span>
                            {frequency === "daily"
                              ? "Every day"
                              : "Every week"}
                          </span>

                          {time && (
                            <>
                              <span>•</span>
                              <span>{time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] font-medium leading-5 text-red-600">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={creating || editing}
                className="rounded-lg px-4 py-2.5 text-[11px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  modalMode === "create"
                    ? createHabit
                    : updateHabit
                }
                disabled={
                  creating ||
                  editing ||
                  !name.trim()
                }
                className="flex min-w-[115px] items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {creating || editing ? (
                  <>
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />

                    {modalMode === "create"
                      ? "Creating..."
                      : "Saving..."}
                  </>
                ) : (
                  <>
                    {modalMode === "create" ? (
                      <Plus size={13} />
                    ) : (
                      <Check size={13} />
                    )}

                    {modalMode === "create"
                      ? "Create Habit"
                      : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deletingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

            <div className="px-5 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Trash2 size={17} />
              </div>

              <h2 className="mt-4 text-sm font-bold">
                Delete this habit?
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-gray-500">
                This will permanently remove the
                habit and its completion history.
                This action cannot be undone.
              </p>
            </div>

            <div className="mt-5 flex gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={deleteLoading}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[11px] font-semibold text-gray-600 transition hover:text-black disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteHabit}
                disabled={deleteLoading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500 px-3 py-2.5 text-[11px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
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