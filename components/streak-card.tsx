import { Flame } from "lucide-react";

export default function StreakCard() {
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
          7
        </span>

        <span className="mb-1 text-xs text-gray-400">
          days
        </span>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Best streak{" "}
        <b className="text-black">
          14 days
        </b>
      </p>
    </div>
  );
}
