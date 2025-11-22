// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  callbacks: {
    async redirect() {
      return "https://dahdouhv1.vercel.app/app";
    },

    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user?.email });

      if (session.user && user?._id) {
        (session.user as any).id = user._id.toString();
      }

      return session;
    },

    async signIn({ profile }) {
      await connectDB();

      const email = profile?.email;
      if (!email) return false;

      let user = await User.findOne({ email });

      if (!user) {
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

  secret: process.env.NEXTAUTH_SECRET,
};

const { handlers } = NextAuth(authConfig);
export const { GET, POST } = handlers;