// src/app/api/auth/[...nextauth]/route.ts

// 💡 FIX 1: Change import to the standard root for the main function
import NextAuth, { Session, User as NextAuthUser, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // 💡 FIX 2: Explicitly type the arguments for the Session callback
    async session({ session }: { session: Session }) { 
      await connectDB();
      const user = await User.findOne({ email: session.user?.email });

      if (session.user && user?._id) {
        // You MUST have a 'next-auth.d.ts' file to define 'session.user.id: string'
        (session.user as any).id = user._id.toString(); 
      }

      return session;
    },

    // 💡 FIX 3: Explicitly type the arguments for the SignIn callback
    async signIn({ profile }: { profile?: Profile }) {
      await connectDB();

      // Ensure profile exists and has an email
      const email = profile?.email;
      if (!email) return false;

      let user = await User.findOne({ email });

      if (!user) {
        // Safe check for username creation
        const newUsername = profile?.given_name 
          ? profile.given_name.replace(/\s+/g, "").toLowerCase()
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
    signIn: "/auth/signin", // Changed from '/signin' to '/auth/signin' based on previous context
    error: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Required for Next.js Route Handlers
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
