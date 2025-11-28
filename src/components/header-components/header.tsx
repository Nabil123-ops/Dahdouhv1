"use client";

import React from "react";
import SignInNow from "@/components/header-components/signin-now";
import { auth } from "@/auth";
import TopLoader from "./top-loader";
import GeminiLogo from "./gemini-logo";

const Header = async () => {
  const session = await auth();

  // DEFAULT
  let userPlan = "free";

  // Fetch subscription plan from API (server component)
  if (session?.user?.email) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getUserPlan?email=${session.user.email}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      userPlan = data.plan || "free";
    } catch (e) {
      console.log("Plan fetch failed", e);
    }
  }

  // STYLE CLASS FOR BADGES
  const badgeStyle = {
    advanced:
      "px-4 py-2 rounded-xl bg-purple-500/10 text-purple-700 font-semibold border border-purple-300",
    creator:
      "px-4 py-2 rounded-xl bg-blue-500/10 text-blue-700 font-semibold border border-blue-300",
  };

  // BADGE LABEL
  const planLabel = {
    free: "",
    advanced: "⭐ Advanced Plan",
    creator: "🚀 Pro Creator",
  };

  return (
    <header className="w-full h-fit flex-shrink-0 flex items-center p-3 md:px-10 px-5 md:justify-between relative justify-end">
      
      {/* LOGO */}
      <div className="md:block hidden">
        <GeminiLogo />
      </div>

      <div className="flex items-center gap-4">

        {/* SHOW BADGE ONLY IF USER IS LOGGED IN */}
        {session?.user && userPlan !== "free" && (
          <div className={badgeStyle[userPlan as "advanced" | "creator"]}>
            {planLabel[userPlan as "advanced" | "creator"]}
          </div>
        )}

        <SignInNow userData={session?.user} />
        <TopLoader />
      </div>
    </header>
  );
};

export default Header;