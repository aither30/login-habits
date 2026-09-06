"use client";

import { useState } from "react";
import { Check, Clock3 } from "lucide-react";

type Props = {
  emoji: string;
  title: string;
  description: string;
  time?: string;
};

export default function HabitCard({
  emoji,
  title,
  description,
  time,
}: Props) {
  const [completed, setCompleted] = useState(false);

  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200 sm:gap-4 sm:p-4 ${
        completed
          ? "border-gray-200 bg-gray-50"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg sm:h-12 sm:w-12 sm:text-xl">
        {emoji}
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className={`truncate text-sm font-semibold sm:text-[15px] ${
            completed ? "text-gray-400 line-through" : ""
          }`}
        >
          {title}
        </h3>

        <p className="mt-1 truncate text-xs text-gray-400 sm:text-sm">
          {description}
        </p>

        {time && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
            <Clock3 size={11} />
            {time}
          </div>
        )}
      </div>

      <button
        onClick={() => setCompleted(!completed)}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all sm:h-10 sm:w-10 ${
          completed
            ? "border-black bg-black text-white"
            : "border-gray-300 text-transparent hover:border-black"
        }`}
      >
        <Check size={16} strokeWidth={3} />
      </button>
    </div>
  );
}
