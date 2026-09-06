"use client";

import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            <p className="text-xs font-medium text-gray-400">
              Preferences
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Settings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your account and HabitFlow preferences.
            </p>

            {/* PROFILE */}
            <section className="mt-7 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Profile
              </p>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "Profile"}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-black text-2xl font-bold text-white">
                    {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="text-xl font-bold">
                    {session?.user?.name ?? "User"}
                  </h2>

                  <p className="mt-1 truncate text-sm text-gray-400">
                    {session?.user?.email ?? "No email"}
                  </p>

                  <div className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-500">
                    Google Account
                  </div>
                </div>
              </div>
            </section>

            {/* PREFERENCES */}
            <section className="mt-4 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Preferences
              </p>

              <div className="mt-5 divide-y">
                <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                  <div>
                    <p className="text-sm font-semibold">
                      Appearance
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Choose how HabitFlow looks.
                    </p>
                  </div>

                  <button className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold">
                    Light
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Notifications
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Habit reminders and updates.
                    </p>
                  </div>

                  <div className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white">
                    ON
                  </div>
                </div>
              </div>
            </section>

            {/* LOGOUT */}
            <section className="mt-4 rounded-3xl border border-red-100 bg-white p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">
                Account
              </p>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Sign out
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Sign out from this HabitFlow account.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/login",
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 sm:w-auto"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </section>

          </div>
        </section>

        <MobileNav />
      </div>
    </main>
  );
}
