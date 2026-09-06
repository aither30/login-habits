import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import GoalCard from "@/components/goal-card";
import { Plus } from "lucide-react";

export default function GoalsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  Long-term progress
                </p>

                <h1 className="mt-1 text-3xl font-bold">
                  Goals
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Turn your habits into meaningful goals.
                </p>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white sm:w-auto">
                <Plus size={16} />
                New Goal
              </button>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <GoalCard
                title="Build a Consistent Morning"
                description="Complete your morning habits for 30 days."
              />

              <GoalCard
                title="Learn English"
                description="Practice English every day for 3 months."
              />

              <GoalCard
                title="Become Better at Coding"
                description="Study programming consistently."
              />

              <GoalCard
                title="Read More Books"
                description="Finish 12 books this year."
              />
            </div>
          </div>
        </section>

        <MobileNav />
      </div>
    </main>
  );
}
