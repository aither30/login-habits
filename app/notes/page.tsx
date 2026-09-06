import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import NoteCard from "@/components/note-card";
import { Plus } from "lucide-react";

export default function NotesPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  Personal journal
                </p>

                <h1 className="mt-1 text-3xl font-bold">
                  Notes
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Capture thoughts, ideas, and reflections.
                </p>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white sm:w-auto">
                <Plus size={16} />
                New Note
              </button>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <NoteCard />
              <NoteCard />
              <NoteCard />
            </div>
          </div>
        </section>

        <MobileNav />
      </div>
    </main>
  );
}
