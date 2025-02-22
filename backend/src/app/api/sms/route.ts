import { Request, Response } from 'express';

// send message out
export async function POST(request: Request) {

    // parse data
    const data = request.body;
    console.log("Received data:", data);
    const { body, to } = data;

    // import twilio
    const twilio = require("twilio");

    // set up twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken && body && to) {
        // create twilio client
        const client = new twilio(accountSid, authToken);

        // send message, return sid
        client.messages
            .create({
                body: body,
                from: "+18125065259",
                to: to,
            })
            .then((message: { sid: string }) => console.log(message.sid));
    } else {
        console.error(
            "You are missing one of the variables you need to send a message"
        );
    }
}
