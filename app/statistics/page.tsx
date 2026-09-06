import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import WeeklyChart from "@/components/weekly-chart";

const stats = [
  ["78%", "Completion Rate"],
  ["124", "Habits Completed"],
  ["14 days", "Best Streak"],
  ["6", "Total Habits"],
];

export default function StatisticsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

            <p className="text-xs font-medium text-gray-400">
              Overview
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Statistics
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Understand your consistency and progress.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <p className="text-2xl font-bold">
                    {value}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <WeeklyChart />

              <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-bold">
                  Habit Performance
                </h2>

                <div className="mt-5 space-y-5">
                  {[
                    ["Bangun Pagi", "92%"],
                    ["Minum Air", "86%"],
                    ["Belajar Coding", "71%"],
                    ["English Practice", "64%"],
                  ].map(([name, value]) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">
                          {name}
                        </span>

                        <span className="text-gray-400">
                          {value}
                        </span>
                      </div>

                      <div className="mt-2 h-2 rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{ width: value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <MobileNav />
      </div>
    </main>
  );
}
