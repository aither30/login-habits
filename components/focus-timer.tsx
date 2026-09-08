"use client";

import { useEffect, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  Maximize2,
} from "lucide-react";

const presets = [15, 25, 30, 45, 60];

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");

  const total = minutes * 60;

  const progress =
    total > 0
      ? ((total - seconds) / total) * 100
      : 0;

  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const ss = (seconds % 60)
    .toString()
    .padStart(2, "0");

  const circumference = 276;

  const isPaused =
    !running &&
    seconds > 0 &&
    seconds < total;

  const isFinished = seconds === 0;

  /*
   * =========================
   * FULLSCREEN
   * =========================
   */

  async function enterFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Browser/device tidak mengizinkan fullscreen.
      // Focus mode tetap bisa berjalan sebagai fallback.
    }
  }

  async function exitFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen errors.
    }
  }

  /*
   * =========================
   * TIMER
   * =========================
   */

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  /*
   * =========================
   * TIMER FINISHED
   * =========================
   */

  useEffect(() => {
    if (!isFinished) return;

    exitFullscreen();
  }, [isFinished]);

  /*
   * =========================
   * BROWSER ESC
   * =========================
   *
   * Kalau user menekan Esc,
   * browser keluar fullscreen.
   *
   * Kita juga hentikan timer supaya
   * Focus Mode tidak tetap aktif.
   */

  useEffect(() => {
    function handleFullscreenChange() {
      if (!document.fullscreenElement && running) {
        setRunning(false);
      }
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, [running]);

  /*
   * =========================
   * PRESETS
   * =========================
   */

  function selectPreset(value: number) {
    setMinutes(value);
    setSeconds(value * 60);
    setRunning(false);
    setCustomMode(false);

    exitFullscreen();
  }

  function applyCustom() {
    const value = Number(customMinutes);

    if (
      !Number.isFinite(value) ||
      value < 1 ||
      value > 180
    ) {
      return;
    }

    setMinutes(value);
    setSeconds(value * 60);
    setRunning(false);
    setCustomMode(false);
    setCustomMinutes("");

    exitFullscreen();
  }

  /*
   * =========================
   * START / CONTINUE
   * =========================
   */

  async function startOrContinue() {
    if (seconds <= 0) {
      setSeconds(minutes * 60);
    }

    await enterFullscreen();

    setRunning(true);
  }

  /*
   * =========================
   * PAUSE
   * =========================
   *
   * Pause = langsung keluar fullscreen.
   */

  function pauseFocus() {
    setRunning(false);
    exitFullscreen();
  }

  /*
   * =========================
   * RESET
   * =========================
   */

  function reset() {
    setRunning(false);
    setSeconds(minutes * 60);
    exitFullscreen();
  }

  /*
   * =========================
   * FULL FOCUS MODE
   * =========================
   */

  if (running) {
    return (
      <div className="fixed inset-0 z-[9999] flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[#050505] px-5 text-white">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[55vw] w-[55vw] max-h-[600px] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />
        </div>

        <div className="relative flex h-full w-full flex-col items-center justify-center">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
              Focus mode
            </span>
          </div>

          {/* Timer */}
          <div className="relative mt-8 flex aspect-square w-[min(72vw,55vh,520px)] items-center justify-center">
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-white/[0.08]"
              />

              {/* Progress */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference -
                  (circumference * progress) / 100
                }
                className="text-white transition-all duration-500"
              />
            </svg>

            <div className="relative text-center">
              <div className="font-mono text-[clamp(4rem,14vw,9rem)] font-bold leading-none tracking-[-0.07em]">
                {mm}:{ss}
              </div>

              <p className="mt-5 text-xs font-medium text-gray-600">
                Stay focused...
              </p>
            </div>
          </div>

          {/* Session */}
          <div className="mt-7 text-center">
            <p className="text-sm font-semibold text-gray-400">
              Deep Work
            </p>

            <p className="mt-1 text-[10px] text-gray-600">
              {minutes} minute session
            </p>
          </div>

          {/* Controls */}
          <div className="mt-8 flex w-full max-w-sm gap-2">
            <button
              type="button"
              onClick={pauseFocus}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold text-black transition hover:bg-gray-200"
            >
              <Pause size={15} />
              Pause
            </button>

            <button
              type="button"
              onClick={reset}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:bg-white/5 hover:text-white"
              title="Reset timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <p className="mt-5 text-[10px] text-gray-700">
            Press Esc to exit fullscreen
          </p>
        </div>
      </div>
    );
  }

  /*
   * =========================
   * NORMAL MODE
   * =========================
   */

  return (
    <div className="rounded-2xl bg-black px-4 py-5 text-white sm:px-6 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
            Focus session
          </p>

          <h2 className="mt-0.5 text-sm font-semibold">
            Deep Work
          </h2>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPaused
                ? "bg-white/60"
                : "bg-white/30"
            }`}
          />

          <span className="text-[9px] font-medium text-gray-400">
            {isPaused ? "Paused" : "Ready"}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="relative mx-auto mt-4 flex aspect-square w-full max-w-[205px] items-center justify-center sm:max-w-[220px]">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-white/10"
          />

          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference -
              (circumference * progress) / 100
            }
            className="text-white transition-all duration-500"
          />
        </svg>

        <div className="relative text-center">
          <div className="font-mono text-5xl font-bold tracking-[-0.05em] sm:text-[3.4rem]">
            {mm}:{ss}
          </div>

          <p className="mt-1 text-[9px] text-gray-500">
            {isPaused
              ? "Session paused"
              : isFinished
                ? "Session complete"
                : "Ready when you are"}
          </p>
        </div>
      </div>

      {/* Session length */}
      {!customMode && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Session length
            </p>

            <span className="text-[9px] text-gray-600">
              {minutes} min
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {presets.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => selectPreset(value)}
                className={`rounded-lg py-2 text-[10px] font-semibold transition ${
                  minutes === value
                    ? "bg-white text-black"
                    : "bg-white/8 text-gray-400 hover:bg-white/15 hover:text-white"
                }`}
              >
                {value}m
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCustomMode(true)}
              className="rounded-lg bg-white/8 py-2 text-[10px] font-semibold text-gray-400 transition hover:bg-white/15 hover:text-white"
            >
              Custom
            </button>
          </div>
        </div>
      )}

      {/* Custom */}
      {customMode && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Custom minutes
            </p>

            <button
              type="button"
              onClick={() => setCustomMode(false)}
              className="text-[9px] text-gray-500 transition hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="180"
              value={customMinutes}
              onChange={(e) =>
                setCustomMinutes(e.target.value)
              }
              placeholder="37"
              className="h-9 min-w-0 flex-1 rounded-lg bg-white/8 px-3 text-center text-xs outline-none placeholder:text-gray-600 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
            />

            <button
              type="button"
              onClick={applyCustom}
              className="h-9 rounded-lg bg-white px-5 text-xs font-semibold text-black transition hover:bg-gray-200"
            >
              Set
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={startOrContinue}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white text-xs font-semibold text-black transition hover:bg-gray-200"
        >
          <Play size={14} />

          {isPaused
            ? "Continue"
            : "Start Focus"}
        </button>

        <button
          type="button"
          onClick={reset}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-gray-300 transition hover:bg-white/8 hover:text-white"
          title="Reset"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5">
          <Maximize2
            size={10}
            className="text-gray-600"
          />

          <p className="text-[9px] text-gray-600">
            {isPaused
              ? "Continue to resume focus mode"
              : "Start to enter fullscreen"}
          </p>
        </div>

        <p className="text-[9px] font-semibold text-gray-400">
          {minutes} minutes
        </p>
      </div>
    </div>
  );
}