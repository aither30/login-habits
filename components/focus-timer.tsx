"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

const presets = [15, 25, 30, 45, 60];

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");

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

  function selectPreset(value: number) {
    setMinutes(value);
    setSeconds(value * 60);
    setRunning(false);
    setCustomMode(false);
  }

  function applyCustom() {
    const value = Number(customMinutes);

    if (value < 1 || value > 180) return;

    setMinutes(value);
    setSeconds(value * 60);
    setRunning(false);
    setCustomMode(false);
    setCustomMinutes("");
  }

  function reset() {
    setRunning(false);
    setSeconds(minutes * 60);
  }

  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const ss = (seconds % 60)
    .toString()
    .padStart(2, "0");

  const total = minutes * 60;

  const progress =
    total > 0
      ? ((total - seconds) / total) * 100
      : 0;

  const circumference = 276;

  return (
    <div className="rounded-3xl bg-black p-5 text-white sm:p-8">

      <div className="text-center">
        <p className="text-[10px] font-bold tracking-[0.22em] text-gray-500">
          FOCUS SESSION
        </p>

        <h2 className="mt-2 text-lg font-semibold">
          Deep Work
        </h2>
      </div>

      <div className="relative mx-auto mt-6 flex aspect-square w-full max-w-[245px] items-center justify-center sm:mt-8 sm:max-w-[280px]">

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
            strokeWidth="3"
            className="text-white/10"
          />

          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference -
              (circumference * progress) / 100
            }
            className="text-white transition-all duration-500"
          />
        </svg>

        <div className="text-center">
          <div className="text-[clamp(2.5rem,12vw,4.5rem)] font-bold tracking-tight">
            {mm}:{ss}
          </div>

          <p className="mt-1 text-[10px] text-gray-500">
            {running
              ? "Stay focused..."
              : "Ready when you are"}
          </p>
        </div>
      </div>

      {!running && !customMode && (
        <div className="mt-6 sm:mt-8">
          <p className="mb-3 text-center text-[10px] font-semibold text-gray-500">
            SESSION LENGTH
          </p>

          <div className="mx-auto grid max-w-md grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center">
            {presets.map((value) => (
              <button
                key={value}
                onClick={() => selectPreset(value)}
                className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:px-4 ${
                  minutes === value
                    ? "bg-white text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {value}m
              </button>
            ))}

            <button
              onClick={() => setCustomMode(true)}
              className="col-span-3 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/20 sm:col-span-1"
            >
              Custom
            </button>
          </div>
        </div>
      )}

      {!running && customMode && (
        <div className="mx-auto mt-6 max-w-sm">
          <p className="mb-3 text-center text-[10px] font-semibold text-gray-500">
            CUSTOM MINUTES
          </p>

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
              className="min-w-0 flex-1 rounded-xl bg-white/10 px-4 py-3 text-center text-sm outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-white/20"
            />

            <button
              onClick={applyCustom}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Set
            </button>
          </div>

          <button
            onClick={() => setCustomMode(false)}
            className="mt-3 w-full text-xs text-gray-500 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-2 sm:mt-8 sm:justify-center sm:gap-3">
        <button
          onClick={() => setRunning(!running)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 sm:flex-none sm:px-7"
        >
          {running ? (
            <>
              <Pause size={15} />
              Pause
            </>
          ) : (
            <>
              <Play size={15} />
              Start
            </>
          )}
        </button>

        <button
          onClick={reset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white/10 sm:flex-none sm:px-7"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      <p className="mt-5 text-center text-[10px] text-gray-500">
        Current session:{" "}
        <span className="font-semibold text-gray-300">
          {minutes} minutes
        </span>
      </p>
    </div>
  );
}
