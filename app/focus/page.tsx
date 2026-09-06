import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import FocusTimer from "@/components/focus-timer";

export default function FocusPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            <p className="text-xs font-medium text-gray-400">
              Deep work
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Focus
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Protect your attention and get things done.
            </p>

            <div className="mt-7">
              <FocusTimer />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["12", "Sessions"],
                ["4h 30m", "Focus Time"],
                ["87", "Focus Score"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <p className="text-2xl font-bold">
                    {value}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MobileNav />
      </div>
    </main>
  );
}
