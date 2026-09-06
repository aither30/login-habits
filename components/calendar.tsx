"use client";

import { useState } from "react";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

export default function Calendar() {
  const [selected, setSelected] = useState(1);

  const days = Array.from(
    { length: 30 },
    (_, index) => index + 1
  );

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Habit history
          </p>

          <h3 className="mt-1 text-lg font-bold">
            September 2026
          </h3>
        </div>

        <button
          onClick={() => setSelected(1)}
          className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold hover:bg-gray-200"
        >
          Today
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekdays.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="py-1 text-center text-[10px] font-semibold text-gray-400"
          >
            {day}
          </span>
        ))}

        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelected(day)}
            className={`aspect-square rounded-lg text-xs font-medium transition ${
              selected === day
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
