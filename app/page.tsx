"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flame,
  Menu,
  NotebookPen,
  Settings,
  Sparkles,
  Target,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "Preview",
    href: "#preview",
  },
];

const demoHabits = [
  {
    emoji: "📚",
    title: "Read 20 pages",
    description: "Read before sleeping",
    time: "20:00",
    completed: true,
  },
  {
    emoji: "💪",
    title: "Morning workout",
    description: "30 minutes exercise",
    time: "07:00",
    completed: true,
  },
  {
    emoji: "💧",
    title: "Drink 2L water",
    description: "Stay hydrated",
    time: "All day",
    completed: true,
  },
  {
    emoji: "🧘",
    title: "Meditate",
    description: "Take a moment to reset",
    time: "21:00",
    completed: false,
  },
];

const featureItems = [
  {
    icon: <CheckCircle2 size={18} />,
    title: "Daily Habits",
    description:
      "Build routines, check them off, and keep your daily consistency visible.",
  },
  {
    icon: <Flame size={18} />,
    title: "Streaks",
    description:
      "Stay motivated by seeing how long you can keep your momentum alive.",
  },
  {
    icon: <Target size={18} />,
    title: "Goals",
    description:
      "Set measurable goals and watch your progress move toward the finish line.",
  },
  {
    icon: <NotebookPen size={18} />,
    title: "Notes",
    description:
      "Capture thoughts, reflections, ideas, and anything worth remembering.",
  },
  {
    icon: <Timer size={18} />,
    title: "Focus Timer",
    description:
      "Work with focused sessions and keep track of the time you actually invest.",
  },
  {
    icon: <BarChart3 size={18} />,
    title: "Progress",
    description:
      "Understand your consistency through simple stats and progress insights.",
  },
];

export default function Home() {
  const { data: session } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!session;
  const primaryHref = isLoggedIn
    ? "/dashboard"
    : "/login";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  function handleLogout() {
    setProfileOpen(false);

    signOut({
      callbackUrl: "/",
    });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-gray-950">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <nav className="relative flex h-12 items-center justify-between rounded-xl border border-white/70 bg-white/85 px-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] backdrop-blur-2xl sm:h-14 sm:rounded-2xl sm:px-3">

            {/* LOGO */}

            <Link
              href="/"
              className="group flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition duration-300 group-hover:scale-105 sm:h-9 sm:w-9 sm:rounded-xl">
                <CheckCircle2
                  size={17}
                  strokeWidth={2.5}
                />
              </div>

              <span className="text-[13px] font-bold tracking-[-0.04em] sm:text-[15px]">
                HabitFlow
              </span>
            </Link>

            {/* DESKTOP NAV */}

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-lg bg-gray-50 p-0.5 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3.5 py-1.5 text-[9px] font-semibold text-gray-500 transition hover:bg-white hover:text-black"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* DESKTOP ACTION */}

            <div className="hidden items-center gap-1 sm:flex">
              {isLoggedIn ? (
                <div
                  ref={profileRef}
                  className="relative flex items-center gap-1"
                >
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-2.5 py-2 text-[9px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-black"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen(
                        (current) => !current
                      )
                    }
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    className={`flex items-center gap-1.5 rounded-lg border bg-white px-1.5 py-1 transition-all ${
                      profileOpen
                        ? "border-gray-300 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={
                          session.user.name ??
                          "Profile"
                        }
                        className="h-6 w-6 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-[9px] font-bold text-white">
                        {(
                          session.user?.name ??
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <span className="max-w-[80px] truncate text-[9px] font-semibold text-gray-700">
                      {session.user?.name ??
                        "Profile"}
                    </span>

                    <ChevronDown
                      size={11}
                      className={`text-gray-400 transition-transform ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-[calc(100%+7px)] w-[185px] overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-[0_14px_35px_rgba(0,0,0,0.10)]"
                    >
                      <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-2">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={
                              session.user.name ??
                              "Profile"
                            }
                            className="h-7 w-7 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-[10px] font-bold text-white">
                            {(
                              session.user?.name ??
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[9px] font-bold text-gray-900">
                            {session.user?.name ??
                              "Profile"}
                          </p>

                          <p className="truncate text-[7px] text-gray-400">
                            {session.user?.email ??
                              "Account"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-1">
                        <Link
                          href="/dashboard"
                          role="menuitem"
                          onClick={() =>
                            setProfileOpen(false)
                          }
                          className="flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-black"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100">
                            <CheckCircle2 size={12} />
                          </span>

                          Dashboard
                        </Link>

                        <Link
                          href="/settings"
                          role="menuitem"
                          onClick={() =>
                            setProfileOpen(false)
                          }
                          className="flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-black"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100">
                            <Settings size={12} />
                          </span>

                          Settings
                        </Link>
                      </div>

                      <div className="my-1 h-px bg-gray-100" />

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[9px] font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100">
                          <LogoutIcon />
                        </span>

                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-2.5 py-2 text-[9px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-black"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/login"
                    className="group flex items-center gap-1 rounded-lg bg-black px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-gray-800"
                  >
                    Get Started

                    <ArrowRight
                      size={10}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (current) => !current
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 sm:hidden"
              aria-label="Toggle navigation"
            >
              {menuOpen ? (
                <X size={16} />
              ) : (
                <Menu size={16} />
              )}
            </button>
          </nav>

          {/* MOBILE MENU */}

          {menuOpen && (
            <div className="mt-1.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:hidden">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-black"
                >
                  {item.label}
                  <ArrowRight size={11} />
                </a>
              ))}

              <div className="my-1 h-px bg-gray-100" />

              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={
                          session.user.name ??
                          "Profile"
                        }
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                        {(
                          session.user?.name ??
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold text-gray-900">
                        {session.user?.name ??
                          "Profile"}
                      </p>

                      <p className="truncate text-[8px] text-gray-400">
                        {session.user?.email ??
                          "Account"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <CheckCircle2 size={14} />
                    Dashboard
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <Settings size={14} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500"
                  >
                    <LogoutIcon />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block rounded-lg px-3 py-2.5 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/login"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-black px-3 py-2.5 text-[10px] font-semibold text-white"
                  >
                    Get Started
                    <ArrowRight size={12} />
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gray-200/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
            <Sparkles size={10} />

            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-gray-500">
              Your personal productivity workspace
            </span>
          </div>

          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-bold leading-[0.92] tracking-[-0.075em] sm:text-7xl md:text-8xl lg:text-[88px]">
            Your day.
            <br />

            <span className="text-gray-400">
              Your flow.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[11px] leading-5 text-gray-500 sm:text-sm sm:leading-6">
            HabitFlow brings habits, goals, notes,
            focus sessions, and progress into one
            simple workspace — so you can focus on
            becoming better every day.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link
              href={primaryHref}
              className="group flex w-full items-center justify-center gap-1.5 rounded-lg bg-black px-5 py-3 text-[10px] font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-gray-800 sm:w-auto"
            >
              {isLoggedIn
                ? "Open Dashboard"
                : "Start for free"}

              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <a
              href="#preview"
              className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-[10px] font-semibold text-gray-600 transition hover:border-gray-300 hover:text-black sm:w-auto"
            >
              See how it works
            </a>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2.5 text-[8px] text-gray-400">
            <span>Habits</span>
            <span>•</span>
            <span>Goals</span>
            <span>•</span>
            <span>Notes</span>
            <span>•</span>
            <span>Focus</span>
            <span>•</span>
            <span>Progress</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          APP PREVIEW
      ====================================================== */}

      <section
        id="preview"
        className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[24px] border border-gray-200 bg-white p-1.5 shadow-[0_25px_70px_rgba(0,0,0,0.10)] sm:rounded-[30px] sm:p-2">

            {/* BROWSER */}

            <div className="flex items-center gap-1 px-2.5 py-2 sm:px-3">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
              <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
              <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />

              <div className="ml-2 flex h-5 flex-1 items-center rounded-md bg-gray-50 px-2.5">
                <span className="text-[7px] text-gray-400">
                  app.habitflow.com/dashboard
                </span>
              </div>
            </div>

            {/* APP */}

            <div className="rounded-[19px] bg-[#f7f7f5] p-3 sm:rounded-[24px] sm:p-5 md:p-6">

              {/* APP HEADER */}

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[7px] font-medium text-gray-400">
                    Monday, September 7, 2026
                  </p>

                  <h3 className="mt-0.5 text-base font-bold tracking-[-0.04em] sm:text-xl">
                    Good morning 👋
                  </h3>

                  <p className="mt-0.5 text-[7px] text-gray-400 sm:text-[8px]">
                    Make today count. One habit at a time.
                  </p>
                </div>

                <div className="hidden rounded-md bg-black px-2.5 py-1.5 text-[7px] font-semibold text-white sm:block">
                  + New Habit
                </div>
              </div>

              {/* STATS */}

              <div className="mt-3 grid gap-2 lg:grid-cols-4">

                {/* PROGRESS */}

                <DemoStat
                  label="Today's Progress"
                  value="75%"
                  sub="3 / 4 completed"
                  dark
                />

                {/* STREAK */}

                <DemoStat
                  label="Current Streak"
                  value="7"
                  sub="days"
                  icon={<Flame size={12} />}
                />

                {/* GOALS */}

                <DemoStat
                  label="Active Goals"
                  value="3"
                  sub="1 completed"
                  icon={<Target size={12} />}
                />

                {/* FOCUS */}

                <DemoStat
                  label="Focus Time"
                  value="2h 35m"
                  sub="this week"
                  icon={<Clock3 size={12} />}
                />
              </div>

              {/* MAIN GRID */}

              <div className="mt-2 grid gap-2 lg:grid-cols-[1.4fr_0.6fr]">

                {/* HABITS */}

                <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold">
                        Today&apos;s Habits
                      </h4>

                      <p className="mt-0.5 text-[7px] text-gray-400">
                        Keep your momentum going.
                      </p>
                    </div>

                    <span className="rounded-full bg-black px-2 py-1 text-[6px] font-bold text-white">
                      3 / 4
                    </span>
                  </div>

                  <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                    {demoHabits.map(
                      (habit) => (
                        <div
                          key={habit.title}
                          className={`flex items-center gap-2 rounded-lg border p-2 ${
                            habit.completed
                              ? "border-gray-100 bg-gray-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[10px] shadow-sm">
                            {habit.emoji}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-[7px] font-semibold sm:text-[8px] ${
                                habit.completed
                                  ? "text-gray-400 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {habit.title}
                            </p>

                            <p className="mt-0.5 truncate text-[6px] text-gray-400">
                              {habit.description}
                            </p>
                          </div>

                          <span className="hidden text-[6px] text-gray-400 md:block">
                            {habit.time}
                          </span>

                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              habit.completed
                                ? "border-black bg-black text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {habit.completed && (
                              <Check
                                size={7}
                                strokeWidth={3}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* SIDE */}

                <div className="grid gap-2">

                  {/* WEEKLY */}

                  <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[7px] font-bold">
                          Weekly Progress
                        </p>

                        <p className="mt-0.5 text-[6px] text-gray-400">
                          Habit consistency
                        </p>
                      </div>

                      <span className="text-[8px] font-bold">
                        82%
                      </span>
                    </div>

                    <div className="mt-3 flex h-12 items-end gap-1">
                      {[35, 50, 42, 65, 55, 82, 75].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex h-full flex-1 items-end"
                          >
                            <div
                              className="w-full rounded-full bg-black"
                              style={{
                                height: `${height}%`,
                                opacity:
                                  index === 6
                                    ? 1
                                    : 0.2 +
                                      index *
                                        0.1,
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* GOAL */}

                  <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
                        <Target size={13} />
                      </div>

                      <div>
                        <p className="text-[7px] font-bold">
                          Learn React
                        </p>

                        <p className="text-[6px] text-gray-400">
                          72 / 100 hours
                        </p>
                      </div>

                      <span className="ml-auto text-[8px] font-bold">
                        72%
                      </span>
                    </div>

                    <div className="mt-2 h-1 rounded-full bg-gray-100">
                      <div className="h-full w-[72%] rounded-full bg-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM */}

              <div className="mt-2 grid gap-2 sm:grid-cols-3">

                <DemoMiniCard
                  icon={<NotebookPen size={13} />}
                  title="Notes"
                  text="12 saved notes"
                />

                <DemoMiniCard
                  icon={<Timer size={13} />}
                  title="Focus Timer"
                  text="25 min session"
                />

                <DemoMiniCard
                  icon={<BarChart3 size={13} />}
                  title="Progress"
                  text="+18% this month"
                />
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[8px] text-gray-400">
            Everything you need to stay consistent,
            in one place.
          </p>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section
        id="features"
        className="border-y border-gray-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Everything in one place
              </span>

              <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">
                Built around your day.
              </h2>
            </div>

            <p className="max-w-sm text-[9px] leading-4 text-gray-400">
              HabitFlow keeps the important parts of
              personal productivity connected without
              making your workflow complicated.
            </p>
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {featureItems.map(
              (feature) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        id="how-it-works"
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-gray-400">
              How it works
            </span>

            <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">
              Simple by design.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[9px] leading-4 text-gray-400">
              Start small, stay consistent, and let
              your progress become visible.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">

            <StepCard
              number="01"
              title="Plan your day"
              description="Create habits and goals that match the person you want to become."
            />

            <StepCard
              number="02"
              title="Take action"
              description="Complete habits, start focus sessions, and write down what matters."
            />

            <StepCard
              number="03"
              title="See your progress"
              description="Use streaks, statistics, and goals to understand your consistency."
            />
          </div>

          {/* FLOW */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="grid items-center gap-5 md:grid-cols-5">

              <FlowItem
                icon={<CheckCircle2 size={17} />}
                title="Habits"
                text="Daily actions"
              />

              <FlowArrow />

              <FlowItem
                icon={<Target size={17} />}
                title="Goals"
                text="Long-term direction"
              />

              <FlowArrow />

              <FlowItem
                icon={<BarChart3 size={17} />}
                title="Progress"
                text="See the difference"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PHILOSOPHY
      ====================================================== */}

      <section className="border-y border-gray-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">

          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
            <Sparkles size={16} />
          </div>

          <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-bold leading-tight tracking-[-0.055em] sm:text-4xl">
            You don&apos;t need a perfect day.
            <br />

            <span className="text-gray-400">
              You need a consistent one.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-[9px] leading-5 text-gray-400 sm:text-[10px]">
            HabitFlow is designed to make progress
            easier to see, easier to understand, and
            easier to continue.
          </p>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[24px] bg-black px-5 py-10 text-center text-white sm:rounded-[28px] sm:px-10 sm:py-14">

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <CheckCircle2 size={19} />
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-[-0.055em] sm:text-4xl">
            Build your flow.
          </h2>

          <p className="mx-auto mt-2 max-w-md text-[9px] leading-5 text-gray-400 sm:text-[10px]">
            Bring your habits, goals, notes, focus
            sessions, and progress together.
          </p>

          <Link
            href={primaryHref}
            className="group mx-auto mt-5 flex w-fit items-center gap-1.5 rounded-lg bg-white px-5 py-3 text-[10px] font-semibold text-black transition hover:-translate-y-0.5 hover:bg-gray-100"
          >
            {isLoggedIn
              ? "Open Dashboard"
              : "Get started for free"}

            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">

          <Link
            href="/"
            className="flex items-center gap-1.5"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
              <CheckCircle2 size={12} />
            </div>

            <span className="text-[10px] font-bold">
              HabitFlow
            </span>
          </Link>

          <p className="text-[8px] text-gray-400">
            Your habits. Your progress. Your flow.
          </p>

          <Link
            href={
              isLoggedIn
                ? "/dashboard"
                : "/login"
            }
            className="text-[8px] font-semibold text-gray-500 transition hover:text-black"
          >
            {isLoggedIn
              ? "Dashboard"
              : "Sign in"}
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function DemoStat({
  label,
  value,
  sub,
  icon,
  dark = false,
}: {
  label: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3.5 sm:p-4 ${
        dark
          ? "bg-black text-white"
          : "border border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-[7px] ${
            dark
              ? "text-gray-400"
              : "text-gray-400"
          }`}
        >
          {label}
        </p>

        {icon && (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-700">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-1 flex items-end gap-1.5">
        <span className="text-xl font-bold tracking-tight sm:text-2xl">
          {value}
        </span>

        <span
          className={`mb-0.5 text-[6px] ${
            dark
              ? "text-gray-400"
              : "text-gray-400"
          }`}
        >
          {sub}
        </span>
      </div>

      {dark && (
        <div className="mt-2 h-1 rounded-full bg-white/10">
          <div className="h-full w-3/4 rounded-full bg-white" />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MINI CARD
========================================================= */

function DemoMiniCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        {icon}
      </div>

      <div>
        <p className="text-[7px] font-bold">
          {title}
        </p>

        <p className="mt-0.5 text-[6px] text-gray-400">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-[#f7f7f5] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      <h3 className="mt-4 text-xs font-bold">
        {title}
      </h3>

      <p className="mt-1.5 text-[9px] leading-5 text-gray-400">
        {description}
      </p>

      <div className="mt-5 h-px w-8 bg-gray-200 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
    </div>
  );
}

/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <span className="text-3xl font-bold tracking-[-0.06em] text-gray-200">
        {number}
      </span>

      <h3 className="mt-4 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-1.5 text-[9px] leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   FLOW ITEM
========================================================= */

function FlowItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 md:flex-col md:text-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-gray-400">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FLOW ARROW
========================================================= */

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center text-gray-300 md:flex">
      <ArrowRight size={16} />
    </div>
  );
}

/* =========================================================
   LOGOUT ICON
========================================================= */

function LogoutIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line
        x1="21"
        y1="12"
        x2="9"
        y2="12"
      />
    </svg>
  );
}