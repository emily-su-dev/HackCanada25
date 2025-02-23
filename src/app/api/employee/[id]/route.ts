import { NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma-client';

// edit employee content
export async function PATCH(request: Request) {
  // check if request has JSON content type and attempt to parse the body
  const fullUrl = request.url;

  // get account id from URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;
  const employeeId = Number(endpoint.split('/').pop()!);

  try {
    // retrieve data from request
    const data = await request.json();
    console.log('Received data:', data.stack);
    const {
      name,
      position,
      numSmsFails,
      numCallFails,
      numSmsLogs,
      numCallLogs,
    } = data;

    // create a new dictionary with any non-undefined data (to be updated)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (numSmsFails !== undefined) updateData.numSmsFails = numSmsFails;
    if (numCallFails !== undefined) updateData.numCallFails = numCallFails;
    if (numSmsLogs !== undefined) updateData.numSmsLogs = numSmsLogs;
    if (numCallLogs !== undefined) updateData.numCallLogs = numCallLogs;

    // update data
    const updatedEmployee = await prisma.account.update({
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
