"use client";

import { useEffect } from "react";
import { signIn } from "@/auth";

export default function LoginRedirect() {
  useEffect(() => {
    // Automatically redirect to Google Sign-In
    signIn("google", { callbackUrl: "/" });
  }, []);

  return (
    <p className="text-center text-white">Redirecting...</p>
  );
}