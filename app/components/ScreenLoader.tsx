"use client";

// Reusable full-screen loading overlay. Render it with a boolean `show`
// state that you toggle true/false around an API call.
export default function ScreenLoader({ show = true }: { show?: boolean }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 border-t-blue-600" />
        <span className="text-sm font-medium text-zinc-500">Loading…</span>
      </div>
    </div>
  );
}
