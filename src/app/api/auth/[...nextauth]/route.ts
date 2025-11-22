// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { Session, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 💡 FIX: Import NextAuthOptions from the common types subdirectory
import { NextAuthOptions } from "next-auth/core/types"; 

import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

// --- NOTE ON TYPE AUGMENTATION ---
// You will still need to augment the NextAuth Session type globally
// (in a separate 'next-auth.d.ts' file) to include 'session.user.id' 
// without TypeScript errors in your frontend components.

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    // 🟩 Explicitly type the arguments for clarity and type checking
    async session({ session, token }) {
      await connectDB();
      
      // Find the user from the database using the email in the session or token
      // The select("_id") ensures we only fetch the necessary field.
      const dbUser = await User.findOne({ 
        email: session.user?.email || token.email 
      }).select("_id"); 

      if (session.user && dbUser) {
        // Augment the session object with the MongoDB user ID
        // Note: Using 'as any' bypasses the local type issue, 
        // but requires the global 'next-auth.d.ts' file to truly fix it.
        (session.user as any).id = dbUser._id.toString(); 
      }

      return session;
    },

    // 🟩 Explicitly type the signIn arguments
    async signIn({ user }) {
      await connectDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create a default username with a safe fallback
        const newUsername = user.name
          ? user.name.replace(/\s+/g, "").toLowerCase()
          : user.email?.split('@')[0] || "dahdouh-user";
          
        await User.create({
          email: user.email,
          username: newUsername,
          image: user.image,
        });
      }

      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Required for Next.js Route Handlers
const { handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;
