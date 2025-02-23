import { NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma-client';

// edit employee content
export async function PATCH(request: Request) {
  // check if request has JSON content type and attempt to parse the body
  const fullUrl = request.url;

  // get employee id from URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;
  const employeeId = Number(endpoint.split('/').pop()!);

  try {
    // retrieve data from request
    const data = await request.json();
    console.log('Received data:', data);
    const {
      name,
      position,
      numSmsFails,
      numCallFails,
      numEmailFails,
      numSmsLogs,
      numCallLogs,
      numEmailLogs,
    } = data;

    // create a new dictionary with any non-undefined data (to be updated)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (numSmsFails !== undefined) updateData.numSmsFails = numSmsFails;
    if (numCallFails !== undefined) updateData.numCallFails = numCallFails;
    if (numEmailFails !== undefined) updateData.numEmailFails = numEmailFails;
    if (numSmsLogs !== undefined) updateData.numSmsLogs = numSmsLogs;
    if (numCallLogs !== undefined) updateData.numCallLogs = numCallLogs;
    if (numEmailLogs !== undefined) updateData.numEmailLogs = numEmailLogs;

    // update data
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: updateData,
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const fullUrl = request.url;

  // get employee id from URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;
  const employeeId = Number(endpoint.split('/').pop()!);

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Error fetching employee' },
      { status: 500 }
    );
  }
}
