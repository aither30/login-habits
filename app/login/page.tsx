"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f7f5] px-4 py-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gray-200/60 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-gray-200/60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[430px]">
        {/* Logo */}
        <div className="mb-7 flex justify-center">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Go to HabitFlow home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-lg shadow-black/10 transition-transform duration-200 group-hover:-translate-y-0.5">
              <CheckCircle2
                size={21}
                strokeWidth={2.5}
              />
            </div>

            <span className="text-xl font-bold tracking-[-0.04em] text-gray-950">
              HabitFlow
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-gray-950 sm:text-3xl">
              Welcome back 👋
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
              Build better habits, stay
              consistent, and make every day
              count.
            </p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
            className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:translate-y-0"
          >
            {/* Google Icon */}
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
              />

              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
              />

              <path
                fill="#FBBC05"
                d="M6.54 13.6A5.85 5.85 0 0 1 6.23 12c0-.56.1-1.1.31-1.6V7.87H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.13l3.24-2.53Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.37l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
              />
            </svg>

            <span>Continue with Google</span>

            <ArrowRight
              size={16}
              className="ml-auto text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-600"
            />
          </button>

          {/* Divider */}
          <div className="mt-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />

            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-300">
              Simple & secure
            </span>

            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-gray-50 px-2 py-3 text-center">
              <p className="text-xs font-semibold text-gray-800">
                Track
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                Your habits
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 px-2 py-3 text-center">
              <p className="text-xs font-semibold text-gray-800">
                Build
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                Your streak
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 px-2 py-3 text-center">
              <p className="text-xs font-semibold text-gray-800">
                Grow
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                Every day
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-gray-400">
          Your habits. Your progress. Your flow.
        </p>
      </div>
    </main>
  );
}