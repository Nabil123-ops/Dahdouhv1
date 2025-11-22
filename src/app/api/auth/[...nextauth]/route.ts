// src/app/api/auth/[...nextauth]/route.ts

// 💡 FIX 1: Import NextAuthOptions as a NAMED export
import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

// Define the full auth options object with the correct type
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    // 💡 FIX 2: Explicitly type the session callback arguments
    async session({ session, token, user }) {
      await connectDB();
      
      // In NextAuth v5/App Router, `token` often contains the user data
      // Find the user from the database based on the email from the session/token
      const dbUser = await User.findOne({ 
        email: session.user?.email || token.email 
      }).select("_id"); 

      if (session.user && dbUser) {
        // Augment the session object with the MongoDB user ID
        (session.user as any).id = dbUser._id.toString(); 
      }

      return session;
    },

    // 💡 FIX 3: Explicitly type the signIn callback arguments
    async signIn({ user, account, profile, email, credentials }) {
      await connectDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Note: Added a basic fallback for the username just in case user.name is null
        const newUsername = user.name
          ? user.name.replace(/\s+/g, "").toLowerCase()
          : user.email?.split('@')[0] || "user";
          
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

const { handlers } = NextAuth(authOptions);

// Required for Next.js Route Handlers
export const { GET, POST } = handlers;
