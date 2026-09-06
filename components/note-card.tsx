"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";

export default function NoteCard() {
  const [note, setNote] = useState(
    "Remember to stay consistent. Progress takes time."
  );

  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Reflection
          </p>

          <h3 className="mt-2 font-bold">
            Today's thoughts
          </h3>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-black">
          <MoreHorizontal size={17} />
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mt-5 min-h-[100px] w-full resize-none rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600 outline-none transition focus:bg-gray-100"
      />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          Last edited just now
        </p>

        <button className="text-gray-300 transition hover:text-red-500">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
