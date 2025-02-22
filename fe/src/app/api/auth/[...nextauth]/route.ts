import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,

  // sign  in with google
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/Dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
