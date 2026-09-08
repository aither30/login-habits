"use client";

import {
  Clock3,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type NoteCardProps = {
  note: Note;
  onOpen: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDeleted: () => void;
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function NoteCard({
  note,
  onOpen,
  onEdit,
  onDeleted,
}: NoteCardProps) {
  async function deleteNote() {
    const confirmed = window.confirm(
      `Hapus note "${note.title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/notes/${note.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menghapus note."
        );
      }

      onDeleted();
    } catch (error) {
      console.error("DELETE NOTE ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus note."
      );
    }
  }

  return (
    <article className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => onOpen(note)}
          className="min-w-0 flex-1 text-left"
        >
          <h2 className="truncate text-sm font-bold tracking-tight text-gray-950">
            {note.title}
          </h2>

          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-gray-400">
            <Clock3 size={11} />

            <span>
              {formatDate(note.updatedAt)}
            </span>

            <span className="text-gray-300">
              •
            </span>

            <span>
              {formatTime(note.updatedAt)}
            </span>
          </div>
        </button>

        {/* ACTIONS */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(note)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
            title="Edit note"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            onClick={deleteNote}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* CONTENT PREVIEW */}
      <button
        type="button"
        onClick={() => onOpen(note)}
        className="mt-4 block w-full text-left"
      >
        <p className="line-clamp-5 whitespace-pre-line text-xs leading-6 text-gray-500">
          {note.content}
        </p>
      </button>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-gray-300">
          Note
        </span>

        <button
          type="button"
          onClick={() => onOpen(note)}
          className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 transition hover:text-gray-900"
        >
          Open
          <MoreHorizontal size={12} />
        </button>
      </div>
    </article>
  );
}