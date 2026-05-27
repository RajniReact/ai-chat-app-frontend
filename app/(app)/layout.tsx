"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { clearSession, getStoredUser, User } from "@/lib/auth";
import { AppContext } from "@/app/components/AppContext";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Chat" },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/");
      return;
    }

    setUser(stored);
    setIsPremium(localStorage.getItem("premium") === "true");

    socket.connect();

    const onPremium = (data: { userId: string }) => {
      if (data.userId === stored.id) {
        setIsPremium(true);
        localStorage.setItem("premium", "true");
      }
    };

    socket.on("premium_unlocked", onPremium);

    return () => {
      socket.off("premium_unlocked", onPremium);
      socket.disconnect();
    };
  }, [router]);

  const logout = () => {
    clearSession();
    router.replace("/");
  };

  if (!user) return null;

  return (
    <AppContext.Provider value={{ user, isPremium, logout }}>
      <div className="flex h-screen bg-zinc-50">
        <aside className="flex w-56 flex-col border-r border-zinc-200 bg-white">
          <div className="px-6 py-5 text-lg font-semibold text-zinc-900">
            AI Chat
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm ${
                  pathname === link.href
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-end border-b border-zinc-200 bg-white px-6 py-3">
            <Link href="/profile">
              <img
                src={user.picture}
                alt={user.name}
                className="h-9 w-9 rounded-full ring-2 ring-transparent transition hover:ring-blue-500"
              />
            </Link>
          </header>

          <main className="flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}
