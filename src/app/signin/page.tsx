"use client";

import { useEffect } from "react";
import { signIn } from "@/auth";

export default function SignInPage() {
  useEffect(() => {
    // Redirect instantly to Google Sign-In
    signIn("google", { callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Redirecting to Google Sign-In...
    </div>
  );
}