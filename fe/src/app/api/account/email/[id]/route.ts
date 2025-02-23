import { NextResponse } from 'next/server';
import prisma from '../../../../../../utils/prisma-client';

// retrieve user info by email
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log('ID from path:', id);

  if (id === null) {
    return NextResponse.json(
      { error: 'Email must be provided' },
      { status: 400 }
    );
  }

  // retrieve user (since unique we can use find first)
  const user = await prisma.account.findFirst({
    where: {
      email: id,
    },
  });
  // return errors with user not existing
  if (user === null) {
    return NextResponse.json(null, { status: 200 });
  }

  return NextResponse.json(user);
}
