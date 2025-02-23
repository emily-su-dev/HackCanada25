import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma-client';

// create a new user
export async function POST(request: Request) {
  const data = await request.json();
  const { email, name, position, accountId, phoneNumber } = data;

  const newUser = await prisma.employee.create({
    data: {
      email,
      name,
      position,
      accountId,
      phoneNumber,
    },
  });

  return NextResponse.json(newUser);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = Number(searchParams.get('accountId'));

    if (!accountId) {
      return NextResponse.json(
        { error: 'Missing accountId query parameter' },
        { status: 400 }
      );
    }

    // Fetch employee data from your data source
    const employees = await prisma.employee.findMany({
      where: {
        accountId: accountId,
      },
    });

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee data' },
      { status: 500 }
    );
  }
}
