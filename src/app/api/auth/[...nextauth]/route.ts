import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";
import { Session, User as NextAuthUser } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    // 🟩 ADD TYPE HERE
    async session({ session }: { session: Session }) {
      await connectDB();

      const user = await User.findOne({ email: session.user?.email });

      if (session.user && user) {
        session.user.id = user._id.toString();
      }

      return session;
    },

    // 🟩 ADD TYPE HERE
    async signIn({ user }: { user: NextAuthUser }) {
      await connectDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email,
          username: user.name?.replace(/\s+/g, "").toLowerCase(),
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