const data = [
  ["M", 70],
  ["T", 100],
  ["W", 45],
  ["T", 80],
  ["F", 60],
  ["S", 30],
  ["S", 0],
];

export default function WeeklyChart() {
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
          72%
        </span>
      </div>

      <div className="mt-5 flex h-24 items-end justify-between gap-2">
        {data.map(([day, height], index) => (
          <div
            key={`${day}-${index}`}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div className="flex h-20 w-full items-end justify-center">
              <div
                className="w-2.5 rounded-full bg-black transition-all"
                style={{
                  height: `${height}%`,
                  opacity:
                    Number(height) === 0 ? 0.1 : 1,
                }}
              />
            </div>

            <span className="text-[10px] text-gray-400">
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
