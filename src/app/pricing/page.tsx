"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PricingPage() {

  // Load Lemon.js ONLY on this page
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.lemonsqueezy.com/lemon.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        "🔹 50 messages/day",
        "🔹 Access to Think & Flash models",
        "🔹 Basic speed",
        "🔹 No image generation"
      ],
      button: "Start for Free",
      free: true
    },
    {
      name: "Dahdouh AI Advanced",
      price: "$3.75",
      period: "/month",
      highlight: true,
      features: [
        "💎 Unlimited messages",
        "⚡ Faster responses",
        "📸 Vision model included",
        "🧠 Access to all models",
        "🚀 Priority processing",
        "🎨 Image upload"
      ],
      lemonUrl:
        "https://dahdouhai.lemonsqueezy.com/buy/b3d7dcf0-3671-4478-b298-0ba2720afa7a?embed=1"
    },
    {
      name: "Pro Creator",
      price: "$9.99",
      period: "/month",
      features: [
        "🎥 20 AI videos/month",
        "🎨 Image generation HD",
        "📚 Document analysis 200 pages",
        "🤖 API Access (coming soon)"
      ],
      lemonUrl:
        "https://dahdouhai.lemonsqueezy.com/buy/YOUR_PRODUCT_ID?embed=1"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-20">
      <h1 className="text-4xl font-bold text-center mb-10">
        Choose the perfect plan for you
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-2xl border shadow-sm ${
              plan.highlight
                ? "border-purple-500 shadow-purple-300 shadow-lg"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <p className="text-4xl font-bold">
              {plan.price}
              <span className="text-lg font-normal">{plan.period}</span>
            </p>

            <ul className="mt-6 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  {f}
                </li>
              ))}
            </ul>

            {/* FREE PLAN → Normal Link */}
            {plan.free && (
              <Link
                href="/app"
                className="mt-8 block text-center py-3 rounded-xl font-semibold bg-gray-100 dark:bg-gray-800"
              >
                Start for Free
              </Link>
            )}

            {/* PAID PLAN → Lemon Squeezy Embed Button */}
            {!plan.free && (
              <a
                href={plan.lemonUrl}
                className="mt-8 block text-center py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 lemonsqueezy-button"
              >
                {plan.highlight ? "Upgrade Now" : "Get Pro"}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}