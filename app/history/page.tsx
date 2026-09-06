import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import Calendar from "@/components/calendar";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

            <p className="text-xs font-medium text-gray-400">
              Your journey
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              History
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              See how your habits have performed over time.
            </p>

            <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_360px]">
              <Calendar />

              <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Selected day
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  September 1
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  2 of 4 habits completed
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    ["🌅", "Bangun Pagi", true],
                    ["💧", "Minum Air", true],
                    ["💻", "Belajar Coding", false],
                    ["🇬🇧", "English Practice", false],
                  ].map(([emoji, name, completed]) => (
                    <div
                      key={name as string}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <span>{emoji}</span>

                      <span
                        className={`flex-1 text-sm ${
                          completed
                            ? "text-gray-400 line-through"
                            : "font-medium"
                        }`}
                      >
                        {name}
                      </span>

                      <span>
                        {completed ? "✓" : "○"}
                      </span>
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
