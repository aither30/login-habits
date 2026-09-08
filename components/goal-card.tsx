"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  Route,
  Target,
  Trash2,
  Wallet,
  X,
} from "lucide-react";

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

type GoalCardProps = {
  goal: Goal;
  onUpdated?: () => void;
  onDeleted?: () => void;
};

const goalTypeInfo: Record<
  GoalType,
  {
    label: string;
    icon: typeof Target;
    unit: string;
  }
> = {
  COUNT: {
    label: "Count",
    icon: Target,
    unit: "times",
  },
  SAVINGS: {
    label: "Savings",
    icon: Wallet,
    unit: "",
  },
  DISTANCE: {
    label: "Distance",
    icon: Route,
    unit: "km",
  },
  DURATION: {
    label: "Duration",
    icon: Clock3,
    unit: "hours",
  },
};

function getDefaultUnit(type: GoalType): string {
  switch (type) {
    case "SAVINGS":
      return "";

    case "DISTANCE":
      return "km";

    case "DURATION":
      return "hours";

    case "COUNT":
    default:
      return "times";
  }
}

function formatValue(
  value: number,
  type: GoalType,
  unit?: string | null
) {
  if (type === "SAVINGS") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (type === "DISTANCE") {
    return `${value} ${unit || "km"}`;
  }

  if (type === "DURATION") {
    return `${value} ${unit || "hours"}`;
  }

  return `${value} ${unit || "times"}`;
}

function formatDeadline(deadline: string | null) {
  if (!deadline) {
    return null;
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GoalCard({
  goal,
  onUpdated,
  onDeleted,
}: GoalCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const [saving, setSaving] = useState(false);
  const [addingProgress, setAddingProgress] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const previousCompleted = useRef(goal.completed);

  /*
   * =====================================================
   * EDIT FORM
   * =====================================================
   */

  const [editTitle, setEditTitle] = useState(goal.title);

  const [editDescription, setEditDescription] = useState(
    goal.description || ""
  );

  const [editType, setEditType] = useState<GoalType>(
    goal.type || "COUNT"
  );

  const [editTarget, setEditTarget] = useState(
    String(goal.target)
  );

  const [editProgress, setEditProgress] = useState(
    String(goal.progress)
  );

  const [editUnit, setEditUnit] = useState(
    goal.unit ||
      getDefaultUnit(goal.type || "COUNT")
  );

  const [editDeadline, setEditDeadline] = useState(
    goal.deadline
      ? new Date(goal.deadline)
          .toISOString()
          .split("T")[0]
      : ""
  );

  /*
   * =====================================================
   * ADD PROGRESS
   * =====================================================
   */

  const [progressAmount, setProgressAmount] = useState("");

  /*
   * =====================================================
   * OPEN EDIT MODAL
   *
   * Form di-sync hanya saat modal dibuka.
   * Tidak menggunakan useEffect [goal] karena
   * itu dapat menimpa pilihan Type ketika sedang edit.
   * =====================================================
   */

  function openEditModal() {
    const currentType = goal.type || "COUNT";

    setEditTitle(goal.title);

    setEditDescription(
      goal.description || ""
    );

    setEditType(currentType);

    setEditTarget(
      String(goal.target)
    );

    setEditProgress(
      String(goal.progress)
    );

    setEditUnit(
      goal.unit ||
        getDefaultUnit(currentType)
    );

    setEditDeadline(
      goal.deadline
        ? new Date(goal.deadline)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setShowEdit(true);
  }

  /*
   * =====================================================
   * CELEBRATION
   * =====================================================
   */

  useEffect(() => {
    if (
      !previousCompleted.current &&
      goal.completed
    ) {
      setShowCelebration(true);

      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3500);

      return () => {
        clearTimeout(timer);
      };
    }

    previousCompleted.current =
      goal.completed;
  }, [goal.completed]);

  /*
   * =====================================================
   * CARD DATA
   * =====================================================
   */

  const typeInfo =
    goalTypeInfo[
      goal.type || "COUNT"
    ];

  const TypeIcon = typeInfo.icon;

  const percentage =
    goal.target > 0
      ? Math.min(
          100,
          Math.round(
            (goal.progress /
              goal.target) *
              100
          )
        )
      : 0;

  /*
   * =====================================================
   * EDIT GOAL
   * =====================================================
   */

  async function editGoal(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!editTitle.trim()) {
      return;
    }

    const numericTarget =
      Number(editTarget);

    const numericProgress =
      Number(editProgress);

    if (
      !Number.isFinite(
        numericTarget
      ) ||
      numericTarget <= 0
    ) {
      alert(
        "Target harus lebih dari 0."
      );
      return;
    }

    if (
      !Number.isFinite(
        numericProgress
      ) ||
      numericProgress < 0
    ) {
      alert(
        "Progress tidak boleh kurang dari 0."
      );
      return;
    }

    const finalTarget =
      Math.round(numericTarget);

    const finalProgress =
      Math.min(
        Math.round(numericProgress),
        finalTarget
      );

    try {
      setSaving(true);

      const response =
        await fetch(
          `/api/goals/${goal.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title:
                editTitle.trim(),

              description:
                editDescription.trim() ||
                null,

              type: editType,

              target:
                finalTarget,

              progress:
                finalProgress,

              unit:
                editType ===
                "SAVINGS"
                  ? null
                  : editUnit.trim() ||
                    getDefaultUnit(
                      editType
                    ),

              deadline:
                editDeadline || null,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "UPDATE GOAL API ERROR:",
          data
        );

        throw new Error(
          data.error ||
            "Failed to update goal"
        );
      }

      setShowEdit(false);

      onUpdated?.();
    } catch (error) {
      console.error(
        "Failed to update goal:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui goal."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =====================================================
   * ADD PROGRESS
   * =====================================================
   */

  async function addProgress(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const amount =
      Number(progressAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      alert(
        "Masukkan progress yang valid."
      );
      return;
    }

    const newProgress =
      Math.min(
        goal.progress +
          Math.round(amount),
        goal.target
      );

    try {
      setAddingProgress(true);

      const response =
        await fetch(
          `/api/goals/${goal.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              progress:
                newProgress,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "ADD PROGRESS API ERROR:",
          data
        );

        throw new Error(
          data.error ||
            "Failed to update progress"
        );
      }

      setProgressAmount("");
      setShowProgress(false);

      onUpdated?.();
    } catch (error) {
      console.error(
        "Failed to add progress:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan progress."
      );
    } finally {
      setAddingProgress(false);
    }
  }

  /*
   * =====================================================
   * DELETE
   * =====================================================
   */

  async function deleteGoal() {
    const confirmed =
      window.confirm(
        `Hapus goal "${goal.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response =
        await fetch(
          `/api/goals/${goal.id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "DELETE GOAL API ERROR:",
          data
        );

        throw new Error(
          data.error ||
            "Failed to delete goal"
        );
      }

      onDeleted?.();
    } catch (error) {
      console.error(
        "Failed to delete goal:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus goal."
      );
    } finally {
      setDeleting(false);
    }
  }

  /*
   * =====================================================
   * CHANGE TYPE
   * =====================================================
   */

  function handleEditTypeChange(
    type: GoalType
  ) {
    setEditType(type);

    setEditUnit(
      getDefaultUnit(type)
    );
  }

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <>
      {/* =====================================================
          GOAL CARD
      ====================================================== */}

      <div
        className={`relative overflow-hidden rounded-2xl border bg-white p-5 transition-all ${
          goal.completed
            ? "border-gray-300"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                goal.completed
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {goal.completed ? (
                <Check size={18} />
              ) : (
                <TypeIcon size={18} />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-gray-900">
                  {goal.title}
                </h3>

                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {typeInfo.label}
                </span>
              </div>

              {goal.description && (
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {goal.description}
                </p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={openEditModal}
              disabled={
                saving || deleting
              }
              title="Edit goal"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pencil size={14} />
            </button>

            <button
              type="button"
              onClick={deleteGoal}
              disabled={
                saving || deleting
              }
              title="Delete goal"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleting ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-5">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-bold tracking-tight text-gray-900">
                {formatValue(
                  goal.progress,
                  goal.type,
                  goal.unit
                )}
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                dari{" "}
                {formatValue(
                  goal.target,
                  goal.type,
                  goal.unit
                )}
              </p>
            </div>

            <span className="text-xs font-semibold text-gray-500">
              {percentage}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                goal.completed
                  ? "bg-black"
                  : "bg-gray-800"
              }`}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400">
            {goal.deadline
              ? `Deadline ${formatDeadline(
                  goal.deadline
                )}`
              : "No deadline"}
          </div>

          {!goal.completed && (
            <button
              type="button"
              onClick={() =>
                setShowProgress(true)
              }
              className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-gray-800"
            >
              <Plus size={13} />
              Add progress
            </button>
          )}

          {goal.completed && (
            <span className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-[11px] font-semibold text-gray-700">
              <Check size={13} />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {showEdit && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!saving) {
                setShowEdit(false);
              }
            }
          }}
        >
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Edit Goal
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Update your goal details
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEdit(false)
                }
                disabled={saving}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-black disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={editGoal}
              className="px-6 py-5"
            >
              <div className="space-y-4">

                {/* TITLE + DESCRIPTION */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* TITLE */}

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Goal title
                    </label>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) =>
                        setEditTitle(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Save Rp15.000.000"
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Description
                    </label>

                    <input
                      type="text"
                      value={
                        editDescription
                      }
                      onChange={(event) =>
                        setEditDescription(
                          event.target.value
                        )
                      }
                      placeholder="Optional description"
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                {/* TYPE */}

                <div>
                  <label className="mb-2 block text-[11px] font-semibold text-gray-600">
                    Goal type
                  </label>

                  <div className="grid grid-cols-4 gap-2">

                    {(
                      Object.keys(
                        goalTypeInfo
                      ) as GoalType[]
                    ).map((type) => {
                      const info =
                        goalTypeInfo[
                          type
                        ];

                      const Icon =
                        info.icon;

                      const selected =
                        editType ===
                        type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            handleEditTypeChange(
                              type
                            )
                          }
                          className={`flex h-12 items-center justify-center gap-2 rounded-lg border transition ${
                            selected
                              ? "border-black bg-black text-white"
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900"
                          }`}
                        >
                          <Icon size={16} />

                          <span className="text-[11px] font-semibold">
                            {info.label}
                          </span>
                        </button>
                      );
                    })}

                  </div>
                </div>

                {/* TARGET / PROGRESS / UNIT / DEADLINE */}

                <div
                  className={`grid gap-3 ${
                    editType === "SAVINGS"
                      ? "grid-cols-2 md:grid-cols-3"
                      : "grid-cols-2 md:grid-cols-4"
                  }`}
                >

                  {/* TARGET */}

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Target
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        editTarget
                      }
                      onChange={(event) =>
                        setEditTarget(
                          event.target.value
                        )
                      }
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      required
                    />

                    {editType ===
                      "SAVINGS" && (
                      <p className="mt-1 text-[9px] text-gray-400">
                        {formatValue(
                          Number(
                            editTarget
                          ) || 0,
                          "SAVINGS"
                        )}
                      </p>
                    )}
                  </div>

                  {/* PROGRESS */}

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Current progress
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        editProgress
                      }
                      onChange={(event) =>
                        setEditProgress(
                          event.target.value
                        )
                      }
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />

                    {editType ===
                      "SAVINGS" && (
                      <p className="mt-1 text-[9px] text-gray-400">
                        {formatValue(
                          Number(
                            editProgress
                          ) || 0,
                          "SAVINGS"
                        )}
                      </p>
                    )}
                  </div>

                  {/* UNIT */}

                  {editType !==
                    "SAVINGS" && (
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                        Unit
                      </label>

                      <input
                        type="text"
                        value={
                          editUnit
                        }
                        onChange={(
                          event
                        ) =>
                          setEditUnit(
                            event.target
                              .value
                          )
                        }
                        placeholder={getDefaultUnit(
                          editType
                        )}
                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  )}

                  {/* DEADLINE */}

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                      Deadline
                    </label>

                    <input
                      type="date"
                      value={
                        editDeadline
                      }
                      onChange={(
                        event
                      ) =>
                        setEditDeadline(
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

                  <div className="min-w-0">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-gray-400">
                      Preview
                    </p>

                    <p className="mt-0.5 truncate text-xs font-semibold text-gray-900">
                      {formatValue(
                        Number(
                          editProgress
                        ) || 0,
                        editType,
                        editUnit
                      )}

                      <span className="mx-1.5 text-gray-300">
                        /
                      </span>

                      {formatValue(
                        Number(
                          editTarget
                        ) || 0,
                        editType,
                        editUnit
                      )}
                    </p>
                  </div>

                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-[9px] text-gray-400">
                      Progress
                    </p>

                    <p className="text-xs font-bold text-gray-900">
                      {Number(
                        editTarget
                      ) > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (Number(
                                editProgress
                              ) /
                                Number(
                                  editTarget
                                )) *
                                100
                            )
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowEdit(false)
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
                    !editTitle.trim()
                  }
                  className="flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save changes"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD PROGRESS MODAL
      ====================================================== */}

      {showProgress && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!addingProgress) {
                setShowProgress(false);
              }
            }
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Add Progress
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  {goal.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowProgress(false)
                }
                disabled={
                  addingProgress
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-black disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={addProgress}
              className="px-5 py-5"
            >
              <div className="rounded-xl bg-gray-50 p-4">

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-[10px] text-gray-400">
                      Current
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatValue(
                        goal.progress,
                        goal.type,
                        goal.unit
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">
                      Target
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatValue(
                        goal.target,
                        goal.type,
                        goal.unit
                      )}
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-4">

                <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                  Add amount
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    progressAmount
                  }
                  onChange={(event) =>
                    setProgressAmount(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 5"
                  autoFocus
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  required
                />

                <p className="mt-1.5 text-[10px] text-gray-400">
                  Progress otomatis
                  berhenti di target
                  maksimum.
                </p>

              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowProgress(false)
                  }
                  disabled={
                    addingProgress
                  }
                  className="h-9 rounded-lg px-4 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    addingProgress ||
                    !progressAmount
                  }
                  className="flex h-9 min-w-[105px] items-center justify-center gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingProgress && (
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />
                  )}

                  {addingProgress
                    ? "Saving..."
                    : "Add progress"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CELEBRATION
      ====================================================== */}

      {showCelebration && (
        <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">

          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

          <div className="relative mx-4 rounded-2xl border border-gray-200 bg-white px-8 py-7 text-center shadow-2xl">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <Check size={22} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Goal Completed!
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Nice work. You made it happen.
            </p>

            <div className="absolute -inset-10 -z-10 animate-pulse rounded-full border border-gray-200" />
          </div>

          <div className="absolute left-[15%] top-[20%] text-xl animate-bounce">
            ✦
          </div>

          <div className="absolute left-[25%] top-[65%] text-lg animate-pulse">
            ✦
          </div>

          <div className="absolute right-[18%] top-[25%] text-xl animate-bounce">
            ✦
          </div>

          <div className="absolute right-[27%] top-[70%] text-lg animate-pulse">
            ✦
          </div>

        </div>
      )}
    </>
  );
}