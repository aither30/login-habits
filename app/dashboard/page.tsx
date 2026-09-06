import HabitCard from "@/components/habit-card";
import ProgressCard from "@/components/progress-card";
import StreakCard from "@/components/streak-card";
import WeeklyChart from "@/components/weekly-chart";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-gray-950">
      <section className="min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-8">

          {/* =========================================
              TOP HEADER
          ========================================== */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <CalendarDays size={14} />
                Tuesday, September 1, 2026
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                Good afternoon 👋
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Make today count. One habit at a time.
              </p>
            </div>

            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 sm:w-auto">
              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              New Habit
            </button>
          </div>

          {/* =========================================
              TODAY SUMMARY
          ========================================== */}
          <div className="mt-7 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">

            {/* LEFT - PROGRESS + STREAK */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ProgressCard />
              <StreakCard />
            </div>

            {/* RIGHT - WEEKLY CHART */}
            <WeeklyChart />

          </div>

          {/* =========================================
              TODAY'S HABITS
          ========================================== */}
          <section className="mt-9">

            {/* HEADER */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Today's Habits
                  </h2>

                  <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                    2 / 4
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-gray-400 sm:text-sm">
                  Complete your habits and keep your momentum going.
                </p>
              </div>

              <button className="group flex items-center gap-1 text-xs font-semibold text-gray-400 transition hover:text-black">
                View all
                <ChevronRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {/* COMPLETION BAR */}
            <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                    <Check size={16} strokeWidth={2.5} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      Daily completion
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-400">
                      2 of 4 habits completed
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold">
                  50%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-1/2 rounded-full bg-black" />
              </div>
            </div>

            {/* HABITS */}
            <div className="grid gap-3 md:grid-cols-2">
              <HabitCard
                emoji="🌅"
                title="Bangun Pagi"
                description="Bangun sebelum jam 7 pagi"
                time="07:00"
              />

              <HabitCard
                emoji="💧"
                title="Minum Air"
                description="Minum minimal 8 gelas"
                time="08:00"
              />

              <HabitCard
                emoji="💻"
                title="Belajar Coding"
                description="Belajar minimal 1 jam"
                time="19:00"
              />

              <HabitCard
                emoji="🇬🇧"
                title="English Practice"
                description="Practice English for 30 minutes"
                time="20:00"
              />
            </div>
          </section>

          {/* =========================================
              BOTTOM QUICK ACTION
          ========================================== */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Keep your streak alive
              </p>

              <p className="mt-1 text-xs text-gray-400">
                You're doing great. Just 2 more habits to complete today.
              </p>
            </div>

            <button className="group flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-black">
              See your streak
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}