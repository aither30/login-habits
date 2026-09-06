export default function ProgressCard() {
  return (
    <div className="rounded-3xl bg-black p-5 text-white shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Today's Progress
          </p>

          <p className="mt-2 text-4xl font-bold">
            50%
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-white/20 border-t-white text-xs font-bold sm:h-16 sm:w-16">
          2/4
        </div>
      </div>

      <div className="mt-6 h-2 rounded-full bg-white/10">
        <div className="h-full w-1/2 rounded-full bg-white" />
      </div>

      <p className="mt-3 text-[11px] text-gray-400">
        Keep going! You're halfway there.
      </p>
    </div>
  );
}
