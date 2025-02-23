import { NextRequest, NextResponse } from 'next/server';

// send message out
export async function POST(request: NextRequest) {
  // parse data
  const data = await request.json();
  console.log('Received data:', data);
  const { body, to } = data;

  // import twilio
  const twilio = require('twilio');

  // set up twilio client
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken && body && to) {
    // create twilio client
    const client = new twilio(accountSid, authToken);

    try {
      // send message, return sid
      const message = await client.messages.create({
        body: body,
        from: '+16183284945',
        to: to,
      });
      console.log(message.sid);
      return NextResponse.json({ success: true, sid: message.sid });
    } catch (error) {
      console.error('Error sending message:', error);
      return NextResponse.json({
        success: false,
        error: (error as Error).message,
      });
    }
  } else {
    console.error(
      'You are missing one of the variables you need to send a message'
    );
    return NextResponse.json({
      success: false,
      error: 'Missing required variables',
    });
  }
}
