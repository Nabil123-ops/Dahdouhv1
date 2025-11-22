// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/db";
import User from "@/app/models/user.model";

// --- Custom Type Augmentation (Assumed, highly recommended for TS) ---
// Note: This augmentation should ideally be in a separate 'next-auth.d.ts' file
/*
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // <-- Added ID property
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}
*/

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session }) {
      // Establish connection for serverless/cold-start environments
      await connectDB(); 

      // Find user and inject the MongoDB _id into the session
      if (session.user?.email) {
        const user = await User.findOne({ email: session.user.email }).select("_id");

        if (user) {
          session.user.id = user._id.toString();
        }
      }

      return session;
    },

    async signIn({ user }) {
      // Establish connection for serverless/cold-start environments
      await connectDB(); 

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Fallback for username if name is missing or null
        const defaultUsername = user.email ? user.email.split('@')[0] : 'user';
        const newUsername = user.name
          ? user.name.replace(/\s+/g, "").toLowerCase()
          : defaultUsername;

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

// Required for App Router
const { handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;
