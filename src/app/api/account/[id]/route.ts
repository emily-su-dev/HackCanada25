import { NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma-client';

// edit account content
export async function PATCH(request: Request) {
  // check if request has JSON content type and attempt to parse the body
  const fullUrl = request.url;

  // get account id from URL
  const urlObject = new URL(fullUrl);
  const endpoint = urlObject.pathname;
  const accountId = Number(endpoint.split('/').pop()!);

  try {
    // retrieve data from request
    const data = await request.json();
    console.log('Received data:', data.stack);
    const { company } = data;

    // create a new dictionary with any non-undefined data (to be updated)
    const updateData: any = {};
    if (company !== undefined) updateData.company = company;

    // update data
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: updateData,
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}
