"use client";

import {
  ArrowLeft,
  FileText,
  Loader2,
  Pencil,
  Plus,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import NoteCard from "@/components/note-card";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ModalMode =
  | "create"
  | "edit"
  | "view"
  | null;

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalMode, setModalMode] =
    useState<ModalMode>(null);

  const [selectedNote, setSelectedNote] =
    useState<Note | null>(null);

  const [editingNote, setEditingNote] =
    useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /*
   * =========================
   * FETCH NOTES
   * =========================
   */

  const fetchNotes = useCallback(
    async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const response = await fetch("/api/notes", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Gagal mengambil notes."
          );
        }

        setNotes(data);
      } catch (error) {
        console.error(
          "FETCH NOTES ERROR:",
          error
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchNotes(true);
  }, [fetchNotes]);

  /*
   * =========================
   * AUTO REFRESH
   * =========================
   */

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotes(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchNotes]);

  /*
   * =========================
   * CREATE
   * =========================
   */

  function openCreateModal() {
    setModalMode("create");

    setSelectedNote(null);
    setEditingNote(null);

    setTitle("");
    setContent("");
  }

  /*
   * =========================
   * VIEW / OPEN
   * =========================
   */

  function openViewModal(note: Note) {
    setModalMode("view");

    setSelectedNote(note);
    setEditingNote(null);

    setTitle("");
    setContent("");
  }

  /*
   * =========================
   * EDIT
   * =========================
   */

  function openEditModal(note: Note) {
    setModalMode("edit");

    setSelectedNote(null);
    setEditingNote(note);

    setTitle(note.title);
    setContent(note.content);
  }

  /*
   * =========================
   * CLOSE
   * =========================
   */

  function closeModal() {
    if (saving) return;

    setModalMode(null);
    setSelectedNote(null);
    setEditingNote(null);

    setTitle("");
    setContent("");
  }

  /*
   * =========================
   * CHANGE VIEW → EDIT
   * =========================
   */

  function editFromView() {
    if (!selectedNote) return;

    openEditModal(selectedNote);
  }

  /*
   * =========================
   * SAVE
   * =========================
   */

  async function saveNote(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle) {
      alert("Judul note wajib diisi.");
      return;
    }

    if (!cleanContent) {
      alert("Isi note wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const isEditing =
        modalMode === "edit" &&
        editingNote !== null;

      const response = await fetch(
        isEditing
          ? `/api/notes/${editingNote.id}`
          : "/api/notes",
        {
          method: isEditing
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: cleanTitle,
            content: cleanContent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menyimpan note."
        );
      }

      setModalMode(null);
      setSelectedNote(null);
      setEditingNote(null);

      setTitle("");
      setContent("");

      await fetchNotes(false);
    } catch (error) {
      console.error(
        "SAVE NOTE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan note."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =========================
   * ESC
   * =========================
   */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape" &&
        !saving
      ) {
        closeModal();
      }
    }

    if (modalMode) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [modalMode, saving]);

  /*
   * =========================
   * FORMAT DATE
   * =========================
   */

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(new Date(dateString));
  }

  /*
   * =========================
   * PAGE
   * =========================
   */

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

            {/* HEADER */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Personal journal
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Notes
                </h1>

                <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
                  Capture thoughts, ideas, and reflections.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
              >
                <Plus size={15} />

                <span className="hidden sm:inline">
                  New Note
                </span>

                <span className="sm:hidden">
                  New
                </span>
              </button>
            </div>

            {/* COUNT */}
            {!loading && notes.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <FileText
                    size={13}
                    className="text-gray-400"
                  />

                  <span className="text-[10px] font-semibold text-gray-600">
                    {notes.length}{" "}
                    {notes.length === 1
                      ? "note"
                      : "notes"}
                  </span>
                </div>

                <span className="text-[10px] text-gray-400">
                  Auto-synced
                </span>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="mt-8 flex min-h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />

                  Loading notes...
                </div>
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              notes.length === 0 && (
                <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                    <FileText
                      size={20}
                      className="text-gray-400"
                    />
                  </div>

                  <h2 className="mt-4 text-sm font-bold">
                    No notes yet
                  </h2>

                  <p className="mt-1.5 max-w-sm text-xs leading-5 text-gray-400">
                    Write down your thoughts,
                    ideas, plans, or anything
                    you want to remember.
                  </p>

                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-5 flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                  >
                    <Plus size={14} />
                    Create your first note
                  </button>
                </div>
              )}

            {/* NOTES */}
            {!loading &&
              notes.length > 0 && (
                <div className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onOpen={openViewModal}
                      onEdit={openEditModal}
                      onDeleted={() =>
                        fetchNotes(false)
                      }
                    />
                  ))}
                </div>
              )}
          </div>
        </section>

        <MobileNav />
      </div>

      {/* =====================================================
          VIEW MODE
      ====================================================== */}

      {modalMode === "view" &&
        selectedNote && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-3 backdrop-blur-[2px] sm:p-6"
            onMouseDown={(event) => {
              if (
                event.target ===
                  event.currentTarget &&
                !saving
              ) {
                closeModal();
              }
            }}
          >
            <div className="flex max-h-[calc(100vh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:max-h-[calc(100vh-48px)]">

              {/* HEADER */}
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <FileText
                      size={15}
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Note
                    </p>

                    <p className="text-[9px] text-gray-400">
                      {formatDate(
                        selectedNote.updatedAt
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={16} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
                <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                  {selectedNote.title}
                </h2>

                <div className="mt-4 h-px bg-gray-100" />

                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {selectedNote.content}
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50/70 px-4 py-3 sm:px-5">
                <span className="text-[10px] text-gray-400">
                  Read only
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg px-3.5 py-2 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={editFromView}
                    className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* =====================================================
          CREATE / EDIT MODE
      ====================================================== */}

      {(modalMode === "create" ||
        modalMode === "edit") && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-3 backdrop-blur-[2px] sm:p-6"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >
          <div className="flex max-h-[calc(100vh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:max-h-[calc(100vh-48px)]">

            {/* HEADER */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4 sm:px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  {modalMode === "edit" ? (
                    <Pencil
                      size={14}
                      className="text-gray-500"
                    />
                  ) : (
                    <FileText
                      size={15}
                      className="text-gray-500"
                    />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {modalMode === "edit"
                      ? "Edit note"
                      : "New note"}
                  </p>

                  <p className="text-[9px] text-gray-400">
                    {modalMode === "edit"
                      ? "Make changes to your note"
                      : "Write something worth remembering"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={saveNote}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">

                {/* TITLE */}
                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="Note title"
                  maxLength={120}
                  disabled={saving}
                  autoFocus
                  className="w-full border-0 bg-transparent p-0 text-2xl font-bold tracking-tight text-gray-950 outline-none placeholder:text-gray-300 sm:text-3xl"
                />

                {/* DIVIDER */}
                <div className="my-5 h-px bg-gray-100" />

                {/* CONTENT */}
                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder="Start writing..."
                  disabled={saving}
                  className="min-h-[300px] w-full resize-none border-0 bg-transparent p-0 text-sm leading-7 text-gray-700 outline-none placeholder:text-gray-300 sm:min-h-[340px]"
                />
              </div>

              {/* FOOTER */}
              <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50/70 px-4 py-3 sm:px-5">
                <span className="text-[10px] text-gray-400">
                  {content.length > 0
                    ? `${content.length} characters`
                    : "Nothing written yet"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-lg px-3.5 py-2 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      !title.trim() ||
                      !content.trim()
                    }
                    className="flex min-w-[90px] items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {saving && (
                      <Loader2
                        size={13}
                        className="animate-spin"
                      />
                    )}

                    {saving
                      ? "Saving..."
                      : modalMode === "edit"
                        ? "Save"
                        : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}