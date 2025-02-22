import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// prisma
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../../../../prisma-client';


export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
  
    // sign  in with google
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),

    ],
  
    // prisma adapter
    adapter: PrismaAdapter(prisma),
  
    // next-auth db
    database: process.env.DATABASE_URL,
  }
  
  export default NextAuth(authOptions)