type Completion = {
  date: string;
  completed: boolean;
};

type Habit = {
  completions?: Completion[];
};

type Props = {
  habits?: Habit[];
};

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function getStartOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

export default function WeeklyChart({
  habits = [],
}: Props) {
  const today = getStartOfDay(new Date());

  const days = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(today);

      date.setDate(
        today.getDate() - (6 - index)
      );

      return date;
    }
  );

  const chartData = days.map((date) => {
    const dateKey = getDateKey(date);

    const totalHabits = habits.length;
    let completedHabits = 0;

    habits.forEach((habit) => {
      const completed = (
        habit.completions ?? []
      ).some((completion) => {
        if (!completion.completed) {
          return false;
        }

        return (
          getDateKey(
            new Date(completion.date)
          ) === dateKey
        );
      });

      if (completed) {
        completedHabits++;
      }
    });

    const percentage =
      totalHabits > 0
        ? Math.round(
            (completedHabits /
              totalHabits) *
              100
          )
        : 0;

    return {
      day: date.toLocaleDateString(
        "en-US",
        {
          weekday: "narrow",
        }
      ),
      date,
      percentage,
      completedHabits,
      totalHabits,
    };
  });

  const totalPossible =
    habits.length * 7;

  const totalCompleted =
    chartData.reduce(
      (sum, day) =>
        sum + day.completedHabits,
      0
    );

  const weeklyPercentage =
    totalPossible > 0
      ? Math.round(
          (totalCompleted /
            totalPossible) *
            100
        )
      : 0;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">
            This Week
          </h3>

          <p className="mt-1 text-[10px] text-gray-400">
            Habit completion
          </p>
        </div>

        <span className="text-xs font-semibold">
          {weeklyPercentage}%
        </span>
      </div>

      <div className="mt-5 flex h-24 items-end justify-between gap-2">
        {chartData.map((item, index) => (
          <div
            key={`${item.day}-${index}`}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div className="flex h-20 w-full items-end justify-center">
              <div
                className="w-2.5 rounded-full bg-black transition-all duration-500"
                style={{
                  height: `${
                    item.percentage === 0
                      ? 5
                      : item.percentage
                  }%`,
                  opacity:
                    item.percentage === 0
                      ? 0.1
                      : 1,
                }}
                title={`${item.completedHabits}/${item.totalHabits} completed`}
              />
            </div>

            <span
              className={`text-[10px] ${
                getDateKey(item.date) ===
                getDateKey(today)
                  ? "font-bold text-black"
                  : "text-gray-400"
              }`}
            >
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}