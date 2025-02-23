import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received data:', data);

    let { employeeName, companyName, employeePosition } = data;

    // Set defaults for missing values
    if (!employeeName) {
      console.error(
        "Missing employee name. Using 'Valued Employee' as fallback."
      );
      employeeName = 'Valued Employee';
    }

    if (!companyName) {
      console.warn('Missing company name. Using generic security alert.');
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

    // Choose the correct prompt based on missing data
    let prompt = '';

    if (!companyName && !employeePosition) {
      prompt = `Generate a short security alert call script.  
                Address the recipient as ${employeeName} and notify them of an urgent security concern.  
                Keep it vague but professional, under 30 seconds. Ask recipient to call back at +16183284945`;
    } else if (companyName && !employeePosition) {
      prompt = `Generate a security alert call script for ${employeeName} at ${companyName}.  
                The call should warn about an urgent security issue and request immediate action.  
                Keep it professional and realistic, under 30 seconds.  
                Ask recipient to call back at +16183284945`;
    } else if (!companyName && employeePosition) {
      prompt = `Generate a security alert call script for ${employeeName}, who is a ${employeePosition}.  
                The call should be urgent and mention a security issue related to their role.  
                Keep it professional, under 30 seconds, and avoid mentioning a specific company.  Ask recipient to call back at +16183284945`;
    } else {
      prompt = `You are generating a simulated security awareness training call script for employees at ${companyName}.  
                The script should sound like a **real automated call** from a company representative or security system.  
                Address the recipient as ${employeeName}, a ${employeePosition}, and inform them of an urgent account-related issue.  
                Encourage them to take immediate action by calling back at +16183284945.
                Keep the script concise and under 30 seconds.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedMessage = response.text();

    console.log('Generated phishing message:', generatedMessage);
    return NextResponse.json({ message: generatedMessage }, { status: 200 });
  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate phishing Call' },
      { status: 500 }
    );
  }
}
