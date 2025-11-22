// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

const authOptions = {
  // ... (rest of the config object is fine)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user?.email });

      if (session.user && user?._id) {
        // Note: You must globally augment the Session type for this 'id' property to be valid TypeScript
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
        // Ensure you handle potential null/undefined for username creation safely
        const newUsername = profile?.given_name 
          ? profile.given_name.replace(" ", "").toLowerCase() 
          : email.split('@')[0];

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

// 1. Get the main handler function
const handler = NextAuth(authOptions);

// 2. Export the handler under the required HTTP method names
// 💡 FIX: Use the 'handler as GET' and 'handler as POST' pattern
export { handler as GET, handler as POST };
