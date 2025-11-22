// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { Session, Profile } from "next-auth"; // Import necessary types
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // Corrected Session signature: must accept the full parameter object
    async session(params: { session: Session | any, token: any, user: any }) {
      const { session } = params;
      await connectDB();

      const user = await User.findOne({
        email: session.user?.email,
      });

      if (session.user && user?._id) {
        // Use type assertion to satisfy component usage (requires next-auth.d.ts)
        (session.user as any).id = user._id.toString();
      }

      return session;
    },

    // Corrected SignIn signature: must accept all required fields (user, account, profile, etc.)
    async signIn(params: { user: any, account: any, profile?: Profile | any }) { 
      const { profile } = params;
      await connectDB();

      const email = profile?.email;
      if (!email) return false;

      let user = await User.findOne({ email });

      if (!user) {
        const newUsername = profile?.given_name
          ?.replace(/\s+/g, "")
          ?.toLowerCase() || email.split('@')[0];

        await User.create({
          email,
          username: newUsername,
          image: profile?.picture,
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
};

// ⭐ Final Solution: Coerce to 'any' to resolve the final Route Handler type mismatch
const handler = NextAuth(authConfig) as any;

export { handler as GET, handler as POST };
