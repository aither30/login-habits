import { Flame } from "lucide-react";

type Completion = {
  date: string;
  completed: boolean;
};

type Props = {
  completions: Completion[];
};

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function getDayOffset(offset: number) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - offset);

  return getDateKey(date);
}

export default function StreakCard({
  completions,
}: Props) {
  const completedDates = new Set(
    completions
      .filter((completion) => completion.completed)
      .map((completion) =>
        getDateKey(new Date(completion.date))
      )
  );

  /*
   * Current streak
   *
   * Kalau hari ini belum selesai,
   * kita mulai mengecek dari kemarin.
   */
  let currentStreak = 0;

  if (completedDates.has(getDayOffset(0))) {
    currentStreak = 1;

    while (
      completedDates.has(
        getDayOffset(currentStreak)
      )
    ) {
      currentStreak++;
    }
  } else if (completedDates.has(getDayOffset(1))) {
    currentStreak = 1;

    while (
      completedDates.has(
        getDayOffset(currentStreak + 1)
      )
    ) {
      currentStreak++;
    }
  }

  /*
   * Best streak
   */
  const sortedDates = Array.from(completedDates)
    .map((date) => new Date(`${date}T00:00:00`))
    .sort(
      (a, b) => a.getTime() - b.getTime()
    );

  let bestStreak = 0;
  let runningStreak = 0;
  let previousDate: Date | null = null;

  for (const date of sortedDates) {
    if (!previousDate) {
      runningStreak = 1;
    } else {
      const difference =
        (date.getTime() -
          previousDate.getTime()) /
        (1000 * 60 * 60 * 24);

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

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">
          Current Streak
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
          <Flame size={18} />
        </div>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-bold">
          {currentStreak}
        </span>

        <span className="mb-1 text-xs text-gray-400">
          {currentStreak === 1 ? "day" : "days"}
        </span>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Best streak{" "}
        <b className="text-black">
          {bestStreak}{" "}
          {bestStreak === 1 ? "day" : "days"}
        </b>
      </p>
    </div>
  );
}