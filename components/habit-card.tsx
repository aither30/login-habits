"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock3,
  Ellipsis,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

type Props = {
  id: string;
  emoji?: string | null;
  title: string;
  description?: string | null;
  time?: string | null;
  completed?: boolean;
  onCompletedChange?: (
    id: string,
    completed: boolean
  ) => void;
  onEdit?: (habit: {
    id: string;
    name: string;
    description: string | null;
    emoji: string | null;
    time: string | null;
  }) => void;
  onDelete?: (id: string) => void;
};

export default function HabitCard({
  id,
  emoji,
  title,
  description,
  time,
  completed = false,
  onCompletedChange,
  onEdit,
  onDelete,
}: Props) {
  const [isCompleted, setIsCompleted] =
    useState(completed);

  const [loading, setLoading] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCompleted(completed);
  }, [completed]);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  async function toggleCompleted() {
    if (loading) return;

    const nextCompleted = !isCompleted;

    setIsCompleted(nextCompleted);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/habits/${id}/completion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: nextCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update completion"
        );
      }

      onCompletedChange?.(
        id,
        nextCompleted
      );
    } catch (error) {
      console.error(error);

      setIsCompleted(!nextCompleted);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit() {
    setMenuOpen(false);

    onEdit?.({
      id,
      name: title,
      description: description ?? null,
      emoji: emoji ?? null,
      time: time ?? null,
    });
  }

  function handleDelete() {
    setMenuOpen(false);

    onDelete?.(id);
  }

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200 sm:gap-4 sm:p-4 ${
        isCompleted
          ? "border-gray-200 bg-gray-50"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {/* EMOJI */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg sm:h-12 sm:w-12 sm:text-xl">
        {emoji || "✅"}
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <h3
          className={`truncate text-sm font-semibold sm:text-[15px] ${
            isCompleted
              ? "text-gray-400 line-through"
              : "text-gray-900"
          }`}
        >
          {title}
        </h3>

        {description && (
          <p className="mt-1 truncate text-xs text-gray-400 sm:text-sm">
            {description}
          </p>
        )}

        {time && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
            <Clock3 size={11} />
            {time}
          </div>
        )}
      </div>

      {/* ACTION MENU */}
      <div
        ref={menuRef}
        className="relative shrink-0"
      >
        <button
          type="button"
          onClick={() =>
            setMenuOpen(
              (current) => !current
            )
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 opacity-0 transition hover:bg-gray-100 hover:text-black group-hover:opacity-100 focus:opacity-100"
          aria-label={`Actions for ${title}`}
        >
          <Ellipsis size={17} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 z-50 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              onClick={handleEdit}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* CHECK BUTTON */}
      <button
        type="button"
        onClick={toggleCompleted}
        disabled={loading}
        aria-label={
          isCompleted
            ? `Mark ${title} as incomplete`
            : `Complete ${title}`
        }
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all sm:h-10 sm:w-10 ${
          isCompleted
            ? "border-black bg-black text-white"
            : "border-gray-300 text-transparent hover:border-black"
        } ${
          loading
            ? "cursor-wait opacity-70"
            : "cursor-pointer"
        }`}
      >
        {loading ? (
          <Loader2
            size={15}
            className="animate-spin text-gray-400"
          />
        ) : (
          <Check
            size={16}
            strokeWidth={3}
          />
        )}
      </button>
    </div>
  );
}