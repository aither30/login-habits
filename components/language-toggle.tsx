"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/language-provider";

export default function LanguageToggle() {
  const { language, toggleLanguage } =
    useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={
        language === "en"
          ? "Switch to Indonesian"
          : "Ganti ke English"
      }
      aria-label="Change language"
      className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-black hover:shadow-md"
    >
      <Languages
        size={15}
        className="text-gray-400 transition-transform duration-300 group-hover:rotate-12 group-hover:text-black"
      />

      <span>
        {language === "en" ? "ID" : "EN"}
      </span>
    </button>
  );
}