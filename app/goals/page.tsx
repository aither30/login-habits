"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Target,
  Wallet,
  Route,
  Clock3,
  X,
} from "lucide-react";

import GoalCard from "@/components/goal-card";

type GoalType =
  | "COUNT"
  | "SAVINGS"
  | "DISTANCE"
  | "DURATION";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  type: GoalType;
  target: number;
  progress: number;
  unit: string | null;
  deadline: string | null;
  completed: boolean;
};

const goalTypes = [
  {
    type: "COUNT" as GoalType,
    label: "Count",
    description: "Books, workouts, tasks",
    icon: Target,
  },
  {
    type: "SAVINGS" as GoalType,
    label: "Savings",
    description: "Save money",
    icon: Wallet,
  },
  {
    type: "DISTANCE" as GoalType,
    label: "Distance",
    description: "Run, walk, cycle",
    icon: Route,
  },
  {
    type: "DURATION" as GoalType,
    label: "Duration",
    description: "Study, focus, practice",
    icon: Clock3,
  },
];

function getDefaultUnit(type: GoalType) {
  switch (type) {
    case "COUNT":
      return "times";

    case "DISTANCE":
      return "km";

    case "DURATION":
      return "hours";

    case "SAVINGS":
      return null;

    default:
      return null;
  }
}

function getDefaultTarget(type: GoalType) {
  switch (type) {
    case "COUNT":
      return "100";

    case "SAVINGS":
      return "1000000";

    case "DISTANCE":
      return "100";

    case "DURATION":
      return "50";

    default:
      return "100";
  }
}

function getTargetPlaceholder(type: GoalType) {
  switch (type) {
    case "COUNT":
      return "e.g. 12";

    case "SAVINGS":
      return "e.g. 15000000";

    case "DISTANCE":
      return "e.g. 100";

    case "DURATION":
      return "e.g. 50";

    default:
      return "100";
  }
}

function getTargetLabel(type: GoalType) {
  switch (type) {
    case "COUNT":
      return "Target count";

    case "SAVINGS":
      return "Target amount";

    case "DISTANCE":
      return "Target distance";

    case "DURATION":
      return "Target hours";

    default:
      return "Target";
  }
}

function formatTargetPreview(
  value: string,
  type: GoalType
) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return null;
  }

  if (type === "SAVINGS") {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(number);
  }

  if (type === "DISTANCE") {
    return `${number.toLocaleString(
      "en-US"
    )} km`;
  }

  if (type === "DURATION") {
    return `${number.toLocaleString(
      "en-US"
    )} hours`;
  }

  return `${number.toLocaleString(
    "en-US"
  )} times`;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [type, setType] =
    useState<GoalType>("COUNT");

  const [target, setTarget] =
    useState("100");

  const [deadline, setDeadline] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // FILTER
  // =====================================================

  const [filterType, setFilterType] =
    useState<"ALL" | GoalType>("ALL");

  async function fetchGoals(
    showLoading = false
  ) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await fetch(
        "/api/goals",
        {
          cache: "no-store",
          headers: {
            "Cache-Control":
              "no-cache",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch goals"
        );
      }

      const data =
        await response.json();

      setGoals(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch goals:",
        error
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let mounted = true;

    async function refresh(
      showLoading = false
    ) {
      if (!mounted) return;

      await fetchGoals(showLoading);
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

  function openCreateModal() {
    setType("COUNT");
    setTitle("");
    setDescription("");
    setTarget("100");
    setDeadline("");
    setShowModal(true);
  }

  function changeGoalType(
    newType: GoalType
  ) {
    setType(newType);

    setTarget(
      getDefaultTarget(newType)
    );
  }

  async function createGoal(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!title.trim()) return;

    const numericTarget =
      Number(target);

    if (
      !Number.isFinite(
        numericTarget
      ) ||
      numericTarget <= 0
    ) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/goals",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim(),
            type,
            target:
              Math.round(
                numericTarget
              ),
            unit:
              getDefaultUnit(type),
            deadline:
              deadline || null,
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response.json();

        throw new Error(
          data.error ||
            "Failed to create goal"
        );
      }

      setTitle("");
      setDescription("");
      setType("COUNT");
      setTarget("100");
      setDeadline("");

      setShowModal(false);

      await fetchGoals(false);
    } catch (error) {
      console.error(
        "Failed to create goal:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal membuat goal."
      );
    } finally {
      setSaving(false);
    }
  }

  const completedGoals =
    goals.filter(
      (goal) => goal.completed
    ).length;

  const activeGoals =
    goals.filter(
      (goal) => !goal.completed
    ).length;

  // =====================================================
  // FILTERED GOALS
  // =====================================================

  const filteredGoals =
    filterType === "ALL"
      ? goals
      : goals.filter(
          (goal) =>
            goal.type === filterType
        );

  const selectedType =
    goalTypes.find(
      (item) => item.type === type
    );

  const TargetIcon =
    selectedType?.icon ?? Target;

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <section className="min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Long-term progress
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-[-0.035em]">
                Goals
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Turn your habits into
                meaningful goals.
              </p>
            </div>

            <button
              type="button"
              onClick={
                openCreateModal
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              <Plus size={16} />
              New Goal
            </button>
          </div>

          {/* SUMMARY */}

          <div className="mt-6 flex items-center gap-6 text-xs">
            <div>
              <span className="font-bold">
                {goals.length}
              </span>{" "}
              <span className="text-gray-400">
                total goals
              </span>
            </div>

            <div className="h-4 w-px bg-gray-200" />

            <div>
              <span className="font-bold">
                {activeGoals}
              </span>{" "}
              <span className="text-gray-400">
                active
              </span>
            </div>

            <div>
              <span className="font-bold">
                {completedGoals}
              </span>{" "}
              <span className="text-gray-400">
                completed
              </span>
            </div>
          </div>

          {/* FILTER */}

          {!loading &&
            goals.length > 0 && (
              <div className="mt-7 overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-2">

                  {/* ALL */}

                  <button
                    type="button"
                    onClick={() =>
                      setFilterType(
                        "ALL"
                      )
                    }
                    className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                      filterType ===
                      "ALL"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
                    }`}
                  >
                    All

                    <span
                      className={`ml-1.5 ${
                        filterType ===
                        "ALL"
                          ? "text-white/50"
                          : "text-gray-400"
                      }`}
                    >
                      {goals.length}
                    </span>
                  </button>

                  {/* TYPES */}

                  {goalTypes.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      const count =
                        goals.filter(
                          (goal) =>
                            goal.type ===
                            item.type
                        ).length;

                      const selected =
                        filterType ===
                        item.type;

                      return (
                        <button
                          key={
                            item.type
                          }
                          type="button"
                          onClick={() =>
                            setFilterType(
                              item.type
                            )
                          }
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                            selected
                              ? "border-black bg-black text-white"
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
                          }`}
                        >
                          <Icon
                            size={14}
                          />

                          <span>
                            {
                              item.label
                            }
                          </span>

                          <span
                            className={
                              selected
                                ? "text-white/50"
                                : "text-gray-400"
                            }
                          >
                            {count}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

          {/* GOALS */}

          {loading ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[190px] animate-pulse rounded-3xl border border-gray-200 bg-white"
                  />
                )
              )}
            </div>
          ) : goals.length === 0 ? (
            <div className="mt-7 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <Plus
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <h2 className="mt-4 text-sm font-bold">
                No goals yet
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs text-gray-400">
                Create a goal and start
                turning your habits into
                long-term progress.
              </p>

              <button
                type="button"
                onClick={
                  openCreateModal
                }
                className="mt-5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800"
              >
                Create your first goal
              </button>
            </div>
          ) : filteredGoals.length ===
            0 ? (
            <div className="mt-7 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <Target
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <h2 className="mt-4 text-sm font-bold">
                No{" "}
                {filterType.toLowerCase()}{" "}
                goals
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                You don't have any goals
                in this category yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  setFilterType(
                    "ALL"
                  )
                }
                className="mt-4 text-xs font-semibold text-gray-500 underline underline-offset-4 hover:text-black"
              >
                Show all goals
              </button>
            </div>
          ) : (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {filteredGoals.map(
                (goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdated={() =>
                      fetchGoals(
                        false
                      )
                    }
                    onDeleted={() =>
                      fetchGoals(
                        false
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          NEW GOAL MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!saving) {
                setShowModal(false);
              }
            }
          }}
        >
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  New Goal
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Create a new goal and
                  define what you want to
                  accomplish
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                disabled={saving}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-black disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={createGoal}
              className="px-6 py-5"
            >
              <div className="space-y-4">

                {/* TITLE + DESCRIPTION */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Goal title
                    </label>

                    <input
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value
                        )
                      }
                      placeholder={
                        type ===
                        "SAVINGS"
                          ? "e.g. Save for a laptop"
                          : type ===
                            "DISTANCE"
                          ? "e.g. Run 100 km"
                          : type ===
                            "DURATION"
                          ? "e.g. Study 50 hours"
                          : "e.g. Read 12 books"
                      }
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Description
                    </label>

                    <input
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target.value
                        )
                      }
                      placeholder="Optional description"
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                </div>

                {/* GOAL TYPE */}

                <div>
                  <label className="mb-2 block text-[11px] font-semibold text-gray-600">
                    Goal type
                  </label>

                  <div className="grid grid-cols-4 gap-2">
                    {goalTypes.map(
                      (item) => {
                        const Icon =
                          item.icon;

                        const selected =
                          type ===
                          item.type;

                        return (
                          <button
                            key={
                              item.type
                            }
                            type="button"
                            onClick={() =>
                              changeGoalType(
                                item.type
                              )
                            }
                            className={`flex h-12 items-center justify-center gap-2 rounded-lg border transition ${
                              selected
                                ? "border-black bg-black text-white"
                                : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900"
                            }`}
                          >
                            <Icon
                              size={16}
                            />

                            <div className="min-w-0 text-left">
                              <p className="text-[11px] font-semibold">
                                {
                                  item.label
                                }
                              </p>

                              <p
                                className={`truncate text-[9px] ${
                                  selected
                                    ? "text-white/50"
                                    : "text-gray-400"
                                }`}
                              >
                                {
                                  item.description
                                }
                              </p>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* TARGET + DEADLINE */}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      {getTargetLabel(
                        type
                      )}
                    </label>

                    <div className="relative">
                      {type ===
                        "SAVINGS" && (
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                          Rp
                        </span>
                      )}

                      <input
                        type="number"
                        min="1"
                        value={target}
                        onChange={(
                          event
                        ) =>
                          setTarget(
                            event.target
                              .value
                          )
                        }
                        placeholder={getTargetPlaceholder(
                          type
                        )}
                        className={`h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black ${
                          type ===
                          "SAVINGS"
                            ? "pl-9"
                            : ""
                        }`}
                        required
                      />
                    </div>

                    {formatTargetPreview(
                      target,
                      type
                    ) && (
                      <p className="mt-1 text-[9px] text-gray-400">
                        {formatTargetPreview(
                          target,
                          type
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Deadline
                    </label>

                    <input
                      type="date"
                      value={deadline}
                      onChange={(
                        event
                      ) =>
                        setDeadline(
                          event.target
                            .value
                        )
                      }
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                </div>

                {/* PREVIEW */}

                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                      <TargetIcon
                        size={15}
                        className="text-gray-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-gray-400">
                        Preview
                      </p>

                      <p className="mt-0.5 truncate text-xs font-semibold text-gray-900">
                        {selectedType?.label}{" "}
                        goal
                        <span className="mx-1.5 text-gray-300">
                          ·
                        </span>
                        {formatTargetPreview(
                          target,
                          type
                        ) ||
                          "Set your target"}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-[9px] text-gray-400">
                      Starting progress
                    </p>

                    <p className="text-xs font-bold text-gray-900">
                      0%
                    </p>
                  </div>

                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  disabled={saving}
                  className="h-9 rounded-lg px-4 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !title.trim()
                  }
                  className="flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {saving
                    ? "Creating..."
                    : "Create Goal"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}