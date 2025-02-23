import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../utils/prisma-client';

export async function GET(request: NextRequest) {
  try {
    // Extract employeeId from URL parameters
    const fullUrl = request.url;

    // get account id from URL
    const urlObject = new URL(fullUrl);
    const endpoint = urlObject.pathname;
    const employeeId = Number(endpoint.split('/').pop()!);

    if (isNaN(employeeId)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Increment phishing failure count
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: { numEmailFails: { increment: 1 } },
    });

    console.log(
      `Employee ${employeeId} failed phishing test. numEmailFails increased.`
    );

    return NextResponse.json({
      message: `Employee ${employeeId} phishing failure count updated.`,
      updatedEmployee,
    });
  } catch (error) {
    console.error('Error tracking phishing click:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
