"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

type CalendarProps = {
  habits: Habit[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

const weekdays = [
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
  "S",
];

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function isSameDay(
  a: Date,
  b: Date
) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMondayIndex(date: Date) {
  const day = date.getDay();

  return day === 0 ? 6 : day - 1;
}

export default function Calendar({
  habits,
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const today = new Date();

  const monthName =
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(selectedDate);

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDayOffset =
    getMondayIndex(
      new Date(year, month, 1)
    );

  /*
   * COMPLETION PER DATE
   */
  const completionMap = new Map<
    string,
    number
  >();

  habits.forEach((habit) => {
    (habit.completions ?? []).forEach(
      (completion) => {
        if (!completion.completed) {
          return;
        }

        const key = getDateKey(
          new Date(completion.date)
        );

        completionMap.set(
          key,
          (completionMap.get(key) ?? 0) + 1
        );
      }
    );
  });

  const cells = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    ),
  ];

  function previousMonth() {
    onSelectDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  }

  function nextMonth() {
    onSelectDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  }

  function goToday() {
    onSelectDate(new Date());
  }

  function getIntensity(
    completed: number
  ) {
    if (completed === 0) {
      return "";
    }

    if (completed >= habits.length) {
      return "bg-black text-white";
    }

    if (completed >= 3) {
      return "bg-gray-300 text-gray-900";
    }

    if (completed >= 2) {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-gray-100 text-gray-600";
  }

  return (
    <aside className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-300">
            Calendar
          </p>

          <h2 className="mt-1 text-sm font-bold">
            {monthName}
          </h2>
        </div>

        <button
          type="button"
          onClick={goToday}
          className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[9px] font-semibold text-gray-600 transition hover:bg-gray-200 hover:text-black"
        >
          Today
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={previousMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-black"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="text-[9px] font-medium text-gray-300">
          {year}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-black"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* WEEKDAYS */}
      <div className="mt-4 grid grid-cols-7">
        {weekdays.map(
          (day, index) => (
            <span
              key={`${day}-${index}`}
              className="py-1 text-center text-[9px] font-bold text-gray-300"
            >
              {day}
            </span>
          )
        )}
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map(
          (day, index) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square"
                />
              );
            }

            const date = new Date(
              year,
              month,
              day
            );

            const key = getDateKey(date);

            const completed =
              completionMap.get(key) ?? 0;

            const selected =
              isSameDay(
                date,
                selectedDate
              );

            const isToday =
              isSameDay(date, today);

            const intensity =
              getIntensity(completed);

            return (
              <button
                key={day}
                type="button"
                onClick={() =>
                  onSelectDate(date)
                }
                className={`relative flex aspect-square items-center justify-center rounded-lg text-[10px] font-medium transition-all ${
                  selected
                    ? "bg-black text-white shadow-sm"
                    : intensity ||
                      "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {day}

                {/* ACTIVITY DOT */}
                {completed > 0 &&
                  !selected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-black/60" />
                  )}

                {/* TODAY */}
                {isToday &&
                  !selected && (
                    <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-black/15" />
                  )}
              </button>
            );
          }
        )}
      </div>

      {/* LEGEND */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-400">
            Activity
          </span>

          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-gray-100" />
            <span className="h-2 w-2 rounded-sm bg-gray-200" />
            <span className="h-2 w-2 rounded-sm bg-gray-300" />
            <span className="h-2 w-2 rounded-sm bg-black" />
          </div>
        </div>
      </div>
    </aside>
  );
}