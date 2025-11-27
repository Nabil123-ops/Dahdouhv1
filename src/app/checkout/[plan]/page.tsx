"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { plan } = useParams();

  // DodoPay URLs
  const checkoutLinks: any = {
    advanced:
      "https://checkout.dodopayments.com/buy/pdt_nnNED1K9UDhBZ9H3abu9I?quantity=1&redirect_url=https://www.dahdouhai.live",
    creator:
      "https://checkout.dodopayments.com/buy/pdt_ihRKeEv7TrlZTsZaYxZHE?quantity=1&redirect_url=https://www.dahdouhai.live",
  };

  const planName =
    plan === "advanced" ? "Dahdouh AI Advanced" : "Dahdouh AI Creator";

  const price = plan === "advanced" ? "$3.75 / month" : "$9.99 / month";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="bg-white w-full max-w-4xl shadow-xl rounded-xl p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">
          Upgrade to <span className="text-purple-600">{planName}</span>
        </h1>

        <p className="text-gray-600 mb-8">
          Unlock faster responses, unlimited messages, HD image generation, and more.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT SIDE – DETAILS */}
          <div>
            <h2 className="text-xl font-semibold mb-4">What's included</h2>

            <ul className="space-y-3 text-gray-700">
              <li>✔ Unlimited Messages</li>
              <li>✔ Faster AI responses</li>
              <li>✔ Vision model access</li>
              <li>✔ Priority processing</li>
              {plan === "creator" && (
                <>
                  <li>✔ 20 AI videos per month</li>
                  <li>✔ HD image generation</li>
                  <li>✔ 200-page PDF analysis</li>
                </>
              )}
            </ul>

            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <p className="text-lg font-bold">Total: {price}</p>
              <p className="text-xs text-gray-500">
                You will be charged immediately, then every month.
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-5">
              By upgrading, you agree to the Dahdouh AI Terms of Service and Refund Policy.
            </p>
          </div>

          {/* RIGHT SIDE – PAYMENT IFRAME */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pay securely</h2>

            <iframe
              src={checkoutLinks[plan]}
              className="w-full h-[700px] border rounded-lg"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}