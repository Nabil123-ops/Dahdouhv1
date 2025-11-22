import NextAuth from "next-auth";
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
    async session({ session }) {
      await connectDB();

      const user = await User.findOne({
        email: session.user?.email,
      });

      if (session.user && user?._id) {
        session.user.id = user._id.toString();
      }

      return session;
    },

    async signIn({ profile }) {
      await connectDB();

      const email = profile?.email;
      if (!email) return false;

      let user = await User.findOne({ email });

      if (!user) {
        await User.create({
          email,
          username: profile?.given_name
            ?.replace(" ", "")
            ?.toLowerCase(),
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

// ⭐ next-auth@5 beta uses this EXACT export format:
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };