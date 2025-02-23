import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received data:', data);

    let { employeeName, companyName, employeePosition } = data;

    // Set defaults if values are missing
    if (!employeeName) {
      console.error(
        "Missing employee name. Using 'Valued Employee' as fallback."
      );
      employeeName = 'Valued Employee';
    }

    if (!companyName) {
      console.warn(
        "Missing company name. Using 'Your Organization' as fallback."
      );
      companyName = null;
    }

    if (!employeePosition) {
      console.warn(
        "Missing employee position. Using 'team member' as fallback."
      );
      employeePosition = null;
    }

    // Generate text using Google Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let prompt = '';

    if (!companyName && !employeePosition) {
      prompt = `Generate a short security alert email.  
                Address the recipient as ${employeeName} and notify them of an urgent security concern.  
                Keep it vague but professional, under 500 characters.`;
    } else if (companyName && !employeePosition) {
      prompt = `Generate a security alert email for ${employeeName} at ${companyName}.  
                The message should warn about an urgent security issue and request immediate action.  
                Keep it professional and realistic, under 500 characters.  
                Use https://${companyName.toLowerCase().replace(/\s+/g, '')}.ca/verify${employeeName.replace(/\s+/g, '')} as the verification link.`;
    } else if (!companyName && employeePosition) {
      prompt = `Generate a security alert email for ${employeeName}, who is a ${employeePosition}.  
                The message should be urgent and mention a security issue related to their role.  
                Keep it professional, under 500 characters, and avoid mentioning a specific company.`;
    } else {
      prompt = `Generate a realistic security alert email for a training exercise at ${companyName}, but do not tell them that.  
                The message should sound like a real security alert and should address ${employeeName}, a ${employeePosition}.  
                Encourage them to take immediate action by visiting https://${companyName.toLowerCase().replace(/\s+/g, '')}.ca/verify${employeeName.replace(/\s+/g, '')} or calling a support number.  
                Keep it professional and under 500 characters.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedMessage = response.text();

    console.log('Generated phishing message:', generatedMessage);
    return NextResponse.json({ message: generatedMessage }, { status: 200 });
  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate phishing SMS' },
      { status: 500 }
    );
  }
}
