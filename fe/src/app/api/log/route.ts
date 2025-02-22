import { NextResponse } from 'next/server';
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
