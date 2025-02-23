import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log("Received data:", data);

        const { employeeId, to, body } = data;

        if (!employeeId || !to || !body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate a unique tracking link per employee
        const trackingLink = `https://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/track/${employeeId}`;

<<<<<<< HEAD
        // Append tracking link to the SMS body
        const messageBody = `${body} Click here: ${trackingLink}`;

        // Send SMS via Twilio
        const message = await client.messages.create({
            to,
            from: '+16183284945',
            body: messageBody
        });

        return NextResponse.json({ success: true, trackingLink, messageSid: message.sid });
    } catch (error) {
        console.error("Error sending SMS:", error);
        return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
    }
=======
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
>>>>>>> 8b3f92938efe16a733983a22ff5c1f5e1c9bd559
}
