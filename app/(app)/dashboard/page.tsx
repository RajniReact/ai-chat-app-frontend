"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { loadRazorpay } from "@/lib/razorpay";
import { useApp } from "@/app/components/AppContext";
import ScreenLoader from "@/app/components/ScreenLoader";

export default function DashboardPage() {
  const { user, isPremium } = useApp();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    const ready = await loadRazorpay();
    if (!ready) return;

    setLoading(true);
    try {
      const { data: order } = await api.post("/payment/order");

      const checkout = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "AI Chat Premium",
        description: "Unlock AI reply suggestions",
        prefill: { name: user.name },
        theme: { color: "#2563eb" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(true);
          try {
            await api.post("/payment/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              userId: user.id,
            });
          } finally {
            setLoading(false);
          }
        },
      });

      checkout.open();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your plan and AI features.
        </p>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          {isPremium ? (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-900">Premium plan</h2>
                <p className="text-sm text-zinc-500">
                  AI reply suggestions are unlocked in chat.
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Active
              </span>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-zinc-900">Go Premium</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Unlock AI reply suggestions in chat for a one-time payment of
                ₹499.
              </p>
              <button
                onClick={handleUpgrade}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create order
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
      <ScreenLoader show={loading} />
    </>
  );
}
