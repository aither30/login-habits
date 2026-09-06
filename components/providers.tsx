"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <SessionProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-[#fafafa]">
          <Sidebar />

          <main className="min-h-screen transition-[padding] duration-300 ease-in-out lg:pl-[var(--sidebar-width,260px)]">
            {children}
          </main>

          <MobileNav />
        </div>
      )}
    </SessionProvider>
  );
}