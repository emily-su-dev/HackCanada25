import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { employeeId, email, subject, message } = body;

  if (!employeeId || !email || !subject || !message) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Generate a unique tracking link per employee
  const trackingLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/track/email/${employeeId}`;

  // Append tracking link to the SMS body
  const messageBody = `${message} Click here: ${trackingLink}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: messageBody,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
