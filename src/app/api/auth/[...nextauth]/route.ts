import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/db";
import User from "@/app/models/user.model";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user?.email });

      if (session.user && user) {
        session.user.id = user._id.toString();
      }

      return session;
    },

    async signIn({ user }) {
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

// Required for App Router
const { handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;