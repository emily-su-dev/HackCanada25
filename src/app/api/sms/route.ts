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
}
