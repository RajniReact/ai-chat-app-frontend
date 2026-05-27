"use client";

import { createContext, useContext } from "react";
import { User } from "@/lib/auth";

type AppContextValue = {
  user: User;
  isPremium: boolean;
  logout: () => void;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside the app layout");
  }
  return ctx;
}
