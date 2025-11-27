"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState("");

  // ------------------------------
  // HANDLE PAYMENT
  // ------------------------------
  const handlePayment = async (plan: string) => {
    if (!session?.user?.email) {
      alert("Please sign in first.");
      return;
    }

    setLoadingPlan(plan);

    try {
      const res = await fetch("/api/payments/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: session.user.email,
        }),
      });

      const data = await res.json();
      setLoadingPlan("");

      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        alert("Payment error. Please try again.");
        console.error("Payment API Error:", data);
      }
    } catch (err) {
      setLoadingPlan("");
      alert("Something went wrong.");
      console.error(err);
    }
  };

  // ------------------------------
  // PRICING PLANS
  // ------------------------------
  const plans = [
    {
      name: "Free",
      id: "free",
      price: "$0",
      period: "/month",
      free: true,
      features: [
        "🔹 50 messages/day",
        "🔹 Access to Think & Flash models",
        "🔹 Basic speed",
        "🔹 No image generation",
      ],
    },
    {
      name: "Dahdouh AI Advanced",
      id: "advanced",
      price: "$3.75",
      period: "/month",
      highlight: true,
      features: [
        "💎 Unlimited messages",
        "⚡ Faster responses",
        "📸 Vision model included",
        "🧠 Access to all models",
        "🚀 Priority processing",
        "🎨 Image upload",
      ],
    },
    {
      name: "Pro Creator",
      id: "creator",
      price: "$9.99",
      period: "/month",
      features: [
        "🎥 20 AI videos/month",
        "🎨 HD Image generation",
        "📚 Document analysis 200 pages",
        "🤖 API Access (coming soon)",
      ],
    },
  ];

  // ------------------------------
  // RENDER PAGE
  // ------------------------------
  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-20">
      <h1 className="text-4xl font-bold text-center mb-10">
        Choose the perfect plan for you
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-2xl border shadow-sm transition-all ${
              plan.highlight
                ? "border-purple-500 shadow-purple-300 shadow-lg scale-[1.03]"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>

            <p className="text-4xl font-bold mb-6">
              {plan.price}
              <span className="text-lg font-normal">{plan.period}</span>
            </p>

            <ul className="mt-6 space-y-2 mb-8">
              {plan.features.map((f, i) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  {f}
                </li>
              ))}
            </ul>

            {/* FREE PLAN BUTTON */}
            {plan.free ? (
              <Link
                href="/app"
                className="block text-center py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-800"
              >
                Start for Free
              </Link>
            ) : (
              // PAID PLANS
              <button
                onClick={() => handlePayment(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-3 rounded-xl font-semibold text-white 
                ${
                  plan.highlight
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                disabled:opacity-50`}
              >
                {loadingPlan === plan.id
                  ? "Processing..."
                  : plan.highlight
                  ? "Upgrade Now"
                  : "Get Pro"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}