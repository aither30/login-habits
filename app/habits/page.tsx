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
    if (!completion.completed) {
      return false;
    }

    const date = new Date(
      completion.date
    );

    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  });
}

export default function HabitsPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState<"create" | "edit">(
      "create"
    );

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
    useState<EditingHabit | null>(
      null
    );

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

  const completedCount = useMemo(() => {
    return habits.filter((habit) =>
      isCompletedToday(
        habit.completions
      )
    ).length;
  }, [habits]);

  function openCreateModal() {
    setModalMode("create");

    setEditingHabit(null);

    setName("");
    setDescription("");
    setEmoji("🎯");
    setTime("");
    setFrequency("daily");

    setError("");
    setShowModal(true);
  }

  function openEditModal(habit: {
    id: string;
    name: string;
    description: string | null;
    emoji: string | null;
    time: string | null;
  }) {
    const originalHabit =
      habits.find(
        (item) =>
          item.id === habit.id
      );

    setModalMode("edit");

    setEditingHabit({
      id: habit.id,
      name: habit.name,
      description:
        habit.description,
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
    setEditingHabit(null);
    setError("");
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
            time:
              time || null,
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
            time:
              time || null,
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
            habit.id !==
            deletingId
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

        const todayStart =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );

        const existingCompletion =
          (
            habit.completions ?? []
          ).find(
            (completion) => {
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
            }
          );

        if (existingCompletion) {
          return {
            ...habit,
            completions: (
              habit.completions ??
              []
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
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="mb-4 flex items-center gap-1 text-xs font-semibold text-gray-400 transition hover:text-black"
              >
                <ChevronLeft
                  size={14}
                />
                Dashboard
              </button>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <CalendarDays
                  size={14}
                />

                Your routine
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                All Habits
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your habits and
                keep your routine on track.
              </p>
            </div>

            <button
              type="button"
              onClick={
                openCreateModal
              }
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
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-black p-5 text-white sm:p-6">
              <p className="text-xs text-gray-400">
                Total Habits
              </p>

              <p className="mt-2 text-4xl font-bold">
                {loading
                  ? "..."
                  : habits.length}
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                Your active routine
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <p className="text-xs text-gray-500">
                Completed Today
              </p>

              <p className="mt-2 text-4xl font-bold">
                {loading
                  ? "..."
                  : completedCount}
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                Out of {habits.length} habits
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <p className="text-xs text-gray-500">
                Remaining
              </p>

              <p className="mt-2 text-4xl font-bold">
                {loading
                  ? "..."
                  : Math.max(
                      0,
                      habits.length -
                        completedCount
                    )}
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                Habits left today
              </p>
            </div>
          </div>

          {/* HABIT LIST */}
          <section className="mt-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Your Habits
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Click the checkmark to
                  complete a habit.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-500">
                {completedCount}/
                {habits.length} today
              </span>
            </div>

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
            ) : habits.length ===
              0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                  <Plus size={20} />
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  No habits yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-400">
                  Create your first habit
                  and start building a
                  better routine.
                </p>

                <button
                  type="button"
                  onClick={
                    openCreateModal
                  }
                  className="mt-5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  Create Habit
                </button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {habits.map(
                  (habit) => (
                    <HabitCard
                      key={
                        habit.id
                      }
                      id={
                        habit.id
                      }
                      emoji={
                        habit.emoji
                      }
                      title={
                        habit.name
                      }
                      description={
                        habit.description
                      }
                      time={
                        habit.time
                      }
                      completed={isCompletedToday(
                        habit.completions
                      )}
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
                  )
                )}
              </div>
            )}
          </section>
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
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  {modalMode ===
                  "create"
                    ? "Create new habit"
                    : "Edit habit"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {modalMode ===
                  "create"
                    ? "Build a routine that sticks."
                    : "Update your habit details."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  creating ||
                  editing
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="space-y-5 px-6 py-6">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
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
                      if (
                        modalMode ===
                        "create"
                      ) {
                        createHabit();
                      } else {
                        updateHabit();
                      }
                    }
                  }}
                  placeholder="e.g. Read 20 pages"
                  autoFocus
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white"
                />
              </div>

              {/* EMOJI */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Icon
                </label>

                <div className="grid grid-cols-6 gap-2">
                  {emojis.map(
                    (item) => (
                      <button
                        key={
                          item
                        }
                        type="button"
                        onClick={() =>
                          setEmoji(
                            item
                          )
                        }
                        className={`flex h-11 items-center justify-center rounded-xl border text-lg transition ${
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

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Description
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <input
                  type="text"
                  value={
                    description
                  }
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. Read before sleeping"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white"
                />
              </div>

              {/* TIME + FREQUENCY */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Time
                    <span className="ml-1 font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      type="time"
                      value={
                        time
                      }
                      onChange={(
                        event
                      ) =>
                        setTime(
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Frequency
                  </label>

                  <select
                    value={
                      frequency
                    }
                    onChange={(
                      event
                    ) =>
                      setFrequency(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                  >
                    <option value="daily">
                      Every day
                    </option>

                    <option value="weekly">
                      Every week
                    </option>
                  </select>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  creating ||
                  editing
                }
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:text-black disabled:opacity-50"
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
                  creating ||
                  editing
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ||
                editing ? (
                  <>
                    <Loader2
                      size={15}
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
                      <Plus
                        size={15}
                      />
                    ) : (
                      <Check
                        size={15}
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

      {/* DELETE MODAL */}
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
              This will permanently
              delete this habit and
              its completion history.
              This action cannot be
              undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingId(
                    null
                  )
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
                onClick={
                  deleteHabit
                }
                disabled={
                  deleteLoading
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={15}
                    />
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