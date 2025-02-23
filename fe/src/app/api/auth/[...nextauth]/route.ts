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
    async jwt({ token, user }) {
      // Store email and user ID in the token on first login
      if (user) {
        token.email = user.email;
        try {
          // Step 1: Call GET /account/{email} to check if an account exists
          const getResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/email/${user.email}`,
            { method: 'GET' }
          );
          const getData = await getResponse.json();

          console.log('GET Response:', getResponse); // Debug log
          console.log('GET Data:', getData); // Debug log

          if (getData && getData.id) {
            console.log('Account found:', getData.id);
            token.accountId = getData.id;
          } else {
            console.log('No account found, creating a new one...');
            // Step 2: Call POST /account to create the account
            const postResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email }),
              }
            );
            const postData = await postResponse.json();
            token.accountId = postData.id;
          }
        } catch (error) {
          console.error('Error checking or creating account:', error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email; // Attach email to session
        session.user.id = token.accountId; // Attach user ID to session
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/Dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
