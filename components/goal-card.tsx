"use client";

import { useState } from "react";
import { ArrowUpRight, Target } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export default function GoalCard({
  title,
  description,
}: Props) {
  const [progress, setProgress] = useState(60);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Target size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                {description}
              </p>
            </div>

            <span className="text-sm font-bold">
              {progress}%
            </span>
          </div>

          <div className="mt-5 h-2 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={() =>
              setProgress(Math.min(progress + 10, 100))
            }
            className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black"
          >
            Update progress
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
