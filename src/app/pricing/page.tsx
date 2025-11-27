"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState("");

  // --------------------------------------
  // DODO PAYMENT LINKS
  // --------------------------------------
  const DODO_PLANS: Record<string, string> = {
    advanced:
      "https://checkout.dodopayments.com/buy/pdt_nnNED1K9UDhBZ9H3abu9I?quantity=1&redirect_url=https://www.dahdouhai.live",

    creator:
      "https://checkout.dodopayments.com/buy/pdt_ihRKeEv7TrlZTsZaYxZHE?quantity=1&redirect_url=https://www.dahdouhai.live",
  };

  const handlePayment = (plan: string) => {
    if (!session?.user?.email) {
      alert("Please sign in first.");
      return;
    }

    setLoadingPlan(plan);
    window.location.href = DODO_PLANS[plan];
  };

  // --------------------------------------
  // PLANS
  // --------------------------------------
  const plans = [
    {
      name: "Free",
      id: "free",
      price: "$0",
      period: "/month",
      free: true,
      features: [
        "50 messages/day",
        "Think & Flash models",
        "Basic speed",
        "No image generation",
      ],
    },
    {
      name: "Dahdouh AI Advanced",
      id: "advanced",
      price: "$3.75",
      period: "/month",
      highlight: true,
      features: [
        "Unlimited messages",
        "Faster responses",
        "Vision model",
        "All models access",
        "Priority processing",
        "Image upload",
      ],
    },
    {
      name: "Pro Creator",
      id: "creator",
      price: "$9.99",
      period: "/month",
      features: [
        "20 AI videos/month",
        "HD Image generation",
        "200-page PDF analysis",
        "API Access (soon)",
      ],
    },
  ];

  return (
    <div className="w-full px-4 py-24 md:px-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 
    dark:from-black dark:via-neutral-900 dark:to-neutral-950 select-none">

      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
          Upgrade Your Dahdouh AI Experience
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Choose the perfect plan designed for speed, power, and creation.
        </p>
      </div>

      {/* PLANS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              group relative p-8 rounded-3xl border 
              backdrop-blur-xl bg-white/60 dark:bg-black/40
              shadow-lg hover:shadow-2xl transform hover:-translate-y-1 
              transition-all duration-300 
              ${
                plan.highlight
                  ? "border-purple-500/60 shadow-purple-300/50 dark:shadow-purple-900/50"
                  : "border-gray-200 dark:border-gray-700"
              }
            `}
          >
            {/* Badge */}
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full 
              bg-purple-600 text-white shadow-lg">
                MOST POPULAR
              </span>
            )}

            {/* Title */}
            <h2 className="text-2xl font-bold mb-3">{plan.name}</h2>

            {/* Price */}
            <p className="text-5xl font-extrabold mb-6">
              {plan.price}
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                {plan.period}
              </span>
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-8">
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-gray-800 dark:text-gray-200"
                >
                  <span className="text-purple-500 text-xl">•</span> {f}
                </li>
              ))}
            </ul>

            {/* Buttons */}
            {plan.free ? (
              <Link
                href="/app"
                className="block w-full text-center py-3 rounded-xl font-bold 
                bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700
                transition-all active:scale-95"
              >
                Start for Free
              </Link>
            ) : (
              <button
                onClick={() => handlePayment(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`
                  w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95
                  ${
                    plan.highlight
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:brightness-110"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:brightness-110"
                  }
                  disabled:opacity-50
                `}
              >
                {loadingPlan === plan.id
                  ? "Redirecting..."
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