"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  FileText,
  Goal,
  LayoutDashboard,
  Menu,
  Timer,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Today", href: "/dashboard" },
  { icon: BarChart3, label: "Stats", href: "/statistics" },
  { icon: CalendarDays, label: "History", href: "/history" },
  { icon: Goal, label: "Goals", href: "/goals" },
  { icon: Menu, label: "More", href: "/settings" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md justify-around">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[54px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] font-medium transition ${
                active
                  ? "bg-black text-white"
                  : "text-gray-400"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
