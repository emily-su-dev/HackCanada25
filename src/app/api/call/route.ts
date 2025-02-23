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

    // create TwiML response
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(body);

    try {
      // send call, return sid
      const call = await client.calls.create({
        from: '+16183284945',
        to: to,
        twiml: twiml.toString(),
      });
      console.log(call.sid);
      return NextResponse.json({ success: true, sid: call.sid });
    } catch (error) {
      console.error('Error making call:', error);
      return NextResponse.json({
        success: false,
        error: (error as Error).message,
      });
    }
  } else {
    console.error(
      'You are missing one of the variables you need to make a call'
    );
    return NextResponse.json({
      success: false,
      error: 'Missing required variables',
    });
  }
}
