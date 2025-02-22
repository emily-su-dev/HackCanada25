import { NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma-client';

// create a new user
export async function POST(request: Request) {
  const data = await request.json();
  const { email, name, position } = data;

  const newUser = await prisma.employee.create({
    data: {
      email,
      name,
      position,
    },
  });

  return NextResponse.json(newUser);
}
