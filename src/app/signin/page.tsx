"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Sign in to Dahdouh AI</h1>
      <button
        onClick={() => signIn("google")}
        style={{
          background: "#4285F4",
          color: "white",
          padding: "12px 20px",
          borderRadius: 8,
          border: "none",
          marginTop: 20,
          fontSize: 18,
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}