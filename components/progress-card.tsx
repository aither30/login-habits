type Props = {
  completed: number;
  total: number;
};

export default function ProgressCard({
  completed,
  total,
}: Props) {
  const percentage =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  return (
    <div className="rounded-3xl bg-black p-5 text-white shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Today's Progress
          </p>

          <p className="mt-2 text-4xl font-bold">
            {percentage}%
          </p>
        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-white/20 text-xs font-bold sm:h-16 sm:w-16"
          style={{
            background: `conic-gradient(
              white ${percentage * 3.6}deg,
              rgba(255,255,255,0.08) ${percentage * 3.6}deg
            )`,
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black sm:h-12 sm:w-12">
            {completed}/{total}
          </div>
        </div>
      </div>

      <div className="mt-6 h-2 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-3 text-[11px] text-gray-400">
        {total === 0
          ? "Create your first habit to get started."
          : completed === total
            ? "Amazing! All habits completed today."
            : `${total - completed} habit${
                total - completed !== 1 ? "s" : ""
              } left today.`}
      </p>
    </div>
  );
}