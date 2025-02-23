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

    // send call, return sid
    client.calls
      .create({
        from: '+16183284945',
        to: to,
        twiml: twiml.toString(),
      })
      .then((call: { sid: string }) => console.log(call.sid));
  } else {
    console.error(
      'You are missing one of the variables you need to make a call'
    );
  }
}
