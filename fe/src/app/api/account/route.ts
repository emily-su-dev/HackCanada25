import { NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma-client';

// create a new account
export async function POST(request: Request) {
  const data = await request.json();
  const { email } = data;

  const newUser = await prisma.account.create({
    data: {
      email,
    },
  });

  return NextResponse.json(newUser);
}
