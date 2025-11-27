"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

/**
 * A client component to wrap the application with the next-auth SessionProvider.
 * This ensures that the useSession hook works correctly in client components.
 */
export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
