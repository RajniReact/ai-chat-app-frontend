"use client";

import { useApp } from "@/app/components/AppContext";

export default function ProfilePage() {
  const { user, isPremium, logout } = useApp();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Profile</h1>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt={user.name}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                {user.name}
              </h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4">
            <span className="text-sm text-zinc-600">Plan</span>
            <span className="text-sm font-medium text-zinc-900">
              {isPremium ? "Premium" : "Free"}
            </span>
          </div>

          <button
            onClick={logout}
            className="mt-6 rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
