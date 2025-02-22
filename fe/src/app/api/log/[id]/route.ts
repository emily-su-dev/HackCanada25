import { NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma-client';

// edit log status
export async function PATCH(request: Request) {
  // check if request has JSON content type and attempt to parse the body
  const fullUrl = request.url;

  // get log id from URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;
  const logId = Number(endpoint.split('/').pop()!);

  try {
    // retrieve data from request
    const data = await request.json();
    console.log('Received data:', data.stack);
    const { status } = data;

    // create a new dictionary with any non-undefined data (to be updated)
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;

    // update data
    const updatedLog = await prisma.log.update({
      where: { id: logId },
      data: updateData,
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}
