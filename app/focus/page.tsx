import MobileNav from "@/components/mobile-nav";
import FocusTimer from "@/components/focus-timer";

export default function FocusPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

            {/* HEADER */}

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Deep work
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">
                  Focus
                </h1>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Protect your attention and get things done.
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                <span className="text-[10px] font-semibold text-gray-500">
                  Deep work mode
                </span>
              </div>
            </div>

            {/* FOCUS AREA */}

            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Focus session
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-700">
                      Stay focused. One task at a time.
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 px-2.5 py-1.5">
                    <span className="text-[10px] font-semibold text-gray-400">
                      TODAY
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-8 sm:py-7">
                <FocusTimer />
              </div>
            </div>

            {/* STATS */}

            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                {
                  value: "12",
                  label: "Sessions",
                },
                {
                  value: "4h 30m",
                  label: "Focus Time",
                },
                {
                  value: "87",
                  label: "Focus Score",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-3.5 sm:px-4"
                >
                  <div className="flex items-end justify-between gap-2">
                    <p className="text-lg font-bold tracking-tight sm:text-xl">
                      {stat.value}
                    </p>

                    {stat.label === "Focus Score" && (
                      <span className="mb-0.5 text-[9px] font-semibold text-gray-400">
                        / 100
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-[10px] font-medium text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* FOOTNOTE */}

            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-[10px] text-gray-400">
                Small progress, repeated consistently.
              </p>

              <p className="text-[10px] font-medium text-gray-300">
                HabitFlow
              </p>
            </div>
          </div>
        </section>

        <MobileNav />
      </div>
    </main>
  );
}