"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useLayoutEffect, useState } from "react";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flame,
  Goal,
  LayoutDashboard,
  LogOut,
  Settings,
  Timer,
} from "lucide-react";

const menu = [
  {
    icon: LayoutDashboard,
    label: "Today",
    href: "/dashboard",
  },
  {
    icon: BarChart3,
    label: "Statistics",
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
  {
    icon: Timer,
    label: "Focus",
    href: "/focus",
  },
  {
    icon: FileText,
    label: "Notes",
    href: "/notes",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const name = session?.user?.name ?? "User";
  const email = session?.user?.email ?? "Account";
  const image = session?.user?.image;
  const initial = name.charAt(0).toUpperCase();

  /*
   * Restore saved sidebar state before the browser paints.
   */
  useLayoutEffect(() => {
    const saved = localStorage.getItem("habitflow-sidebar");

    if (saved === "collapsed") {
      setCollapsed(true);
    }

    setHydrated(true);
  }, []);

  /*
   * Keep sidebar width and localStorage synchronized.
   */
  useEffect(() => {
    if (!hydrated) return;

    const width = collapsed ? "76px" : "260px";

    document.documentElement.style.setProperty(
      "--sidebar-width",
      width
    );

    localStorage.setItem(
      "habitflow-sidebar",
      collapsed ? "collapsed" : "expanded"
    );
  }, [collapsed, hydrated]);

  function toggleSidebar() {
    setCollapsed((current) => !current);
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out lg:flex ${
        collapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      {/* =========================
          LOGO
      ========================== */}
      <div
        className={`px-4 pt-6 transition-all duration-300 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <Link
          href="/"
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          {/* LOGO ICON */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-black text-white shadow-sm">
            <CheckCircle2 size={21} />
          </div>

          {/* LOGO TEXT */}
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out ${
              collapsed
                ? "w-0 -translate-x-2 opacity-0"
                : "w-auto translate-x-0 opacity-100"
            }`}
          >
            <h1 className="text-[15px] font-bold">
              HabitFlow
            </h1>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Build better habits
            </p>
          </div>
        </Link>
      </div>

      {/* =========================
          COLLAPSE BUTTON
      ========================== */}
      <button
        type="button"
        onClick={toggleSidebar}
        title={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
        className="absolute -right-3 top-[74px] z-[60] flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-all duration-200 hover:scale-110 hover:text-black"
      >
        {collapsed ? (
          <ChevronRight size={15} />
        ) : (
          <ChevronLeft size={15} />
        )}
      </button>

      {/* =========================
          NAVIGATION
      ========================== */}
      <nav
        className={`mt-7 flex-1 overflow-y-auto transition-all duration-300 ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        {/* WORKSPACE LABEL */}
        <div
          className={`mb-3 overflow-hidden transition-all duration-200 ${
            collapsed
              ? "h-0 opacity-0"
              : "h-auto opacity-100"
          }`}
        >
          <p className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Workspace
          </p>
        </div>

        {/* MENU */}
        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center rounded-xl text-[13px] font-medium transition-all duration-300 ease-in-out ${
                  collapsed
                    ? "justify-center px-2 py-2.5"
                    : "gap-3 px-3 py-2.5"
                } ${
                  active
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {/* MENU ICON */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                    active
                      ? "bg-white/10"
                      : "bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                </span>

                {/* MENU LABEL */}
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out ${
                    collapsed
                      ? "w-0 -translate-x-2 opacity-0"
                      : "flex-1 translate-x-0 opacity-100"
                  }`}
                >
                  {item.label}
                </span>

                {/* ACTIVE INDICATOR */}
                {!collapsed && active && (
                  <ChevronRight
                    size={14}
                    className="shrink-0 opacity-50"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* =========================
          FOOTER
      ========================== */}
      <div className="border-t border-gray-100 px-3 py-3">
        {/* USER PROFILE */}
        <div
          className={`flex h-[56px] items-center rounded-2xl bg-gray-50 p-2 transition-all duration-300 ease-in-out ${
            collapsed
              ? "justify-center"
              : "gap-2"
          }`}
        >
          {/* PROFILE LINK */}
          <Link
            href="/settings"
            title={collapsed ? name : undefined}
            className={`flex min-w-0 items-center transition-all duration-300 ease-in-out ${
              collapsed
                ? "justify-center"
                : "flex-1 gap-3"
            }`}
          >
            {/* AVATAR */}
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-10 w-10 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                {initial}
              </div>
            )}

            {/* USER INFO */}
            <div
              className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out ${
                collapsed
                  ? "w-0 -translate-x-2 opacity-0"
                  : "flex-1 translate-x-0 opacity-100"
              }`}
            >
              <p className="truncate text-xs font-semibold text-gray-900">
                {name}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-gray-400">
                {email}
              </p>
            </div>
          </Link>

          {/* SETTINGS + LOGOUT */}
          <div
            className={`flex shrink-0 items-center gap-1 overflow-hidden transition-all duration-200 ease-in-out ${
              collapsed
                ? "w-0 opacity-0"
                : "w-auto opacity-100"
            }`}
          >
            {/* SETTINGS */}
            <Link
              href="/settings"
              title="Settings"
              aria-label="Settings"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                pathname === "/settings"
                  ? "bg-black text-white"
                  : "text-gray-400 hover:bg-white hover:text-black"
              }`}
            >
              <Settings size={15} />
            </Link>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              title="Logout"
              aria-label="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-white hover:text-red-500"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* VERSION */}
        <div
          className={`overflow-hidden text-center transition-all duration-200 ease-in-out ${
            collapsed
              ? "mt-0 h-0 opacity-0"
              : "mt-3 h-3 opacity-100"
          }`}
        >
          <p className="text-[9px] text-gray-300">
            HabitFlow · v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}