"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  FileText,
  Goal,
  House,
  LayoutDashboard,
  MoreHorizontal,
  Settings,
  Timer,
  X,
} from "lucide-react";

const items = [
  {
    icon: LayoutDashboard,
    label: "Today",
    href: "/dashboard",
  },
  {
    icon: BarChart3,
    label: "Stats",
    href: "/statistics",
  },
  {
    icon: CalendarDays,
    label: "History",
    href: "/history",
  },
  {
    icon: Goal,
    label: "Goals",
    href: "/goals",
  },
];

const moreItems = [
  {
    icon: House,
    label: "Home",
    description: "Back to HabitFlow home",
    href: "/",
  },
  {
    icon: FileText,
    label: "Notes",
    description: "Write and organize your thoughts",
    href: "/notes",
  },
  {
    icon: Timer,
    label: "Focus",
    description: "Stay focused on what matters",
    href: "/focus",
  },
  {
    icon: Settings,
    label: "Settings",
    description: "Manage your preferences",
    href: "/settings",
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  const [showMore, setShowMore] = useState(false);

  const moreActive = moreItems.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" &&
        pathname.startsWith(item.href + "/"))
  );

  // =====================================================
  // CLOSE MENU WHEN NAVIGATING
  // =====================================================

  useEffect(() => {
    setShowMore(false);
  }, [pathname]);

  // =====================================================
  // LOCK BODY SCROLL
  // =====================================================

  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMore]);

  return (
    <>
      {/* =====================================================
          MORE BOTTOM SHEET
      ====================================================== */}

      {showMore && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowMore(false);
            }
          }}
        >
          {/* BACKDROP */}

          <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px] animate-in fade-in duration-200" />

          {/* SHEET */}

          <div className="absolute bottom-0 left-0 right-0 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto max-w-md rounded-t-[28px] border border-gray-200 bg-white px-5 pb-8 pt-4 shadow-2xl">

              {/* HANDLE */}

              <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-gray-200" />

              {/* HEADER */}

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400">
                    Workspace
                  </p>

                  <h2 className="mt-0.5 text-base font-bold tracking-tight text-gray-900">
                    More
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowMore(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-black active:scale-90"
                >
                  <X size={17} />
                </button>
              </div>

              {/* MENU */}

              <div className="space-y-2">
                {moreItems.map((item, index) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    (item.href !== "/" &&
                      pathname.startsWith(
                        item.href + "/"
                      ));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                      className={`group flex animate-in slide-in-from-bottom-2 items-center gap-3 rounded-2xl border p-3 transition-all duration-200 active:scale-[0.98] ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {/* ICON */}

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${
                          active
                            ? "bg-white/10"
                            : "bg-white shadow-sm"
                        }`}
                      >
                        <Icon
                          size={19}
                          className={
                            active
                              ? "text-white"
                              : "text-gray-600"
                          }
                        />
                      </div>

                      {/* TEXT */}

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            active
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </p>

                        <p
                          className={`mt-0.5 truncate text-[10px] ${
                            active
                              ? "text-white/50"
                              : "text-gray-400"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* ARROW */}

                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                          active
                            ? "bg-white/10"
                            : "bg-white"
                        }`}
                      >
                        <span
                          className={`text-sm transition-transform duration-200 group-hover:translate-x-0.5 ${
                            active
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* FOOTER */}

              <p className="mt-5 text-center text-[9px] text-gray-300">
                Keep building better habits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          BOTTOM NAVIGATION
      ====================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around gap-1">

          {/* MAIN NAV */}

          {items.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(
                  item.href + "/"
                ));

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex min-w-[58px] flex-1 flex-col items-center justify-center py-1"
              >
                {/* ACTIVE BACKGROUND */}

                <div
                  className={`absolute inset-x-1 top-0 h-9 rounded-xl transition-all duration-300 ${
                    active
                      ? "scale-100 bg-black opacity-100"
                      : "scale-75 bg-transparent opacity-0"
                  }`}
                />

                {/* ICON */}

                <div
                  className={`relative z-10 flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                    active
                      ? "-translate-y-0.5 scale-105 text-white"
                      : "text-gray-400 group-hover:text-gray-700 group-active:scale-90"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={
                      active ? 2.4 : 2
                    }
                  />
                </div>

                {/* LABEL */}

                <span
                  className={`relative z-10 mt-0.5 text-[9px] font-semibold transition-colors duration-200 ${
                    active
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>

                {/* ACTIVE DOT */}

                {active && (
                  <span className="absolute -bottom-0.5 h-1 w-1 animate-pulse rounded-full bg-black" />
                )}
              </Link>
            );
          })}

          {/* =================================================
              MORE BUTTON
          ================================================== */}

          <button
            type="button"
            aria-label="Open more menu"
            aria-expanded={showMore}
            onClick={() =>
              setShowMore((value) => !value)
            }
            className="group relative flex min-w-[58px] flex-1 flex-col items-center justify-center py-1"
          >
            {/* ACTIVE BACKGROUND */}

            <div
              className={`absolute inset-x-1 top-0 h-9 rounded-xl transition-all duration-300 ${
                showMore || moreActive
                  ? "scale-100 bg-black opacity-100"
                  : "scale-75 bg-transparent opacity-0"
              }`}
            />

            {/* ICON */}

            <div
              className={`relative z-10 flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                showMore || moreActive
                  ? "-translate-y-0.5 scale-105 text-white"
                  : "text-gray-400 group-hover:text-gray-700 group-active:scale-90"
              }`}
            >
              <div
                className={`transition-transform duration-300 ${
                  showMore
                    ? "rotate-90"
                    : "rotate-0"
                }`}
              >
                {showMore ? (
                  <X
                    size={19}
                    strokeWidth={2.4}
                  />
                ) : (
                  <MoreHorizontal
                    size={20}
                    strokeWidth={
                      moreActive ? 2.5 : 2
                    }
                  />
                )}
              </div>
            </div>

            {/* LABEL */}

            <span
              className={`relative z-10 mt-0.5 text-[9px] font-semibold transition-colors duration-200 ${
                showMore || moreActive
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}
            >
              More
            </span>

            {/* ACTIVE DOT */}

            {(showMore || moreActive) && (
              <span className="absolute -bottom-0.5 h-1 w-1 animate-pulse rounded-full bg-black" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}