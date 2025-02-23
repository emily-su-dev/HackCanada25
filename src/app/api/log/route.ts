import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma-client';

// create a new log
export async function POST(request: Request) {
  const data = await request.json();
  const { id, status, method, date, employeeId, accountId } = data;

  const newLog = await prisma.log.create({
    data: {
      id,
      status,
      method,
      date,
      employeeId,
      accountId,
    },
  });

  return NextResponse.json(newLog);
}

// pull logs by accountId
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

    // Fetch logs data from your data source
    const logs = await prisma.log.findMany({
      where: {
        accountId: accountId,
      },
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('Error fetching log data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch log data' },
      { status: 500 }
    );
  }
}
