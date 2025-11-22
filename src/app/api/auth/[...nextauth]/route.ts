// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

// Note: You still need to globally augment the Session type to use session.user.id

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session }: { session: any }) { // Using 'any' for simplicity in beta types
      await connectDB();

      const user = await User.findOne({
        email: session.user?.email,
      });

      if (session.user && user?._id) {
        session.user.id = user._id.toString();
      }

      return session;
    },

    async signIn({ profile }: { profile: any }) { // Using 'any' for simplicity in beta types
      await connectDB();

      const email = profile?.email;
      if (!email) return false;

      let user = await User.findOne({ email });

      if (!user) {
        // Safe creation of username
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

// ⭐ FINAL FIX: Coerce the handler to 'any' to resolve the type mismatch error
const handler = NextAuth(authConfig) as any;

export { handler as GET, handler as POST };
