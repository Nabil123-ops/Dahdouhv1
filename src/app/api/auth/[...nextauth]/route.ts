// src/app/api/auth/[...nextauth]/route.ts

// 1. Use the pattern that provides the destructurable handlers object
import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

// Define authConfig with explicit type assertion to satisfy the compiler
const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // 2. Use a more robust signature (even with 'any' for the parameters)
    async session(params: { session: any, token: any, user: any }) {
      const { session } = params;
      await connectDB();

      const user = await User.findOne({ email: session.user?.email });

      if (session.user && user?._id) {
        (session.user as any).id = user._id.toString();
      }

      return session;
    },

    async signIn(params: { user: any, account: any, profile: any }) {
      const { profile } = params;
      await connectDB();

      const email = profile?.email;
      if (!email) return false;

      let user = await User.findOne({ email });

      if (!user) {
        // Use your existing safe fallback logic
        const newUsername =
          profile.given_name?.toLowerCase()?.replace(/\s+/g, "") ??
          email.split("@")[0];

        await User.create({
          email,
          username: newUsername,
          image: profile.picture,
        });
      }

      return true;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
} as NextAuthConfig; // Assert the final object type

// 3. Use the destructuring pattern which is recommended by NextAuth v5 docs
const { handlers } = NextAuth(authConfig);

// 4. Export the destructured handlers, which are explicitly recognized by Next.js
export const { GET, POST } = handlers;
