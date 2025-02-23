import { Request, Response } from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // Load environment variables

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Generate phishing SMS using Google Gemini API
export async function POST(request: Request, res: Response) {
    try {
        // Parse request data
        const data = request.body;
        console.log("Received data:", data);
        let { employeeName, companyName, employeePosition } = data;

        // Set defaults for missing values
        if (!employeeName) {
            console.error("Missing employee name. Using 'Valued Employee' as fallback.");
            employeeName = "Valued Employee";
        }

        if (!companyName) {
            console.warn("Missing company name. Using generic security alert.");
            companyName = null; // Set to null for later prompt selection
        }

        if (!employeePosition) {
            console.warn("Missing employee position. Using 'team member' as fallback.");
            employeePosition = null; // Set to null for later prompt selection
        }

        // Generate text using Google Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Choose the correct prompt based on missing data
        let prompt = "";

        // Case 1: Only Employee Name is Provided
        if (!companyName && !employeePosition) {
            prompt = `Generate a short security alert call script.  
                Address the recipient as ${employeeName} and notify them of an urgent security concern.  
                Keep it vague but professional, under 30 seconds.`;
        }

        // Case 2: Employee Name + Company Name is Provided (but No Position)
        else if (companyName && !employeePosition) {
            prompt = `Generate a security alert call script for ${employeeName} at ${companyName}.  
                The call should warn about an urgent security issue and request immediate action.  
                Keep it professional and realistic, under 30 seconds.  
                Use https://${companyName.toLowerCase().replace(/\s+/g, '')}.ca/verify${employeeName.replace(/\s+/g, '')} as the verification link.`;
        }

        // Case 3: Employee Name + Employee Position is Provided (but No Company)
        else if (!companyName && employeePosition) {
            prompt = `Generate a security alert call script for ${employeeName}, who is a ${employeePosition}.  
                The call should be urgent and mention a security issue related to their role.  
                Keep it professional, under 30 seconds, and avoid mentioning a specific company.`;
        }

        // Case 4: All Fields Provided (Full Scam Call)
        else {
            prompt = `You are generating a simulated security awareness training call script for employees at ${companyName}.  
                The script should sound like a **real automated call** from a company representative or security system.  
                Address the recipient as ${employeeName}, a ${employeePosition}, and inform them of an urgent account-related issue.  
                Encourage them to take immediate action by visiting https://${companyName.toLowerCase().replace(/\s+/g, '')}.ca/verify${employeeName.replace(/\s+/g, '')} or calling a support number.  
                🚨 **Do NOT include stage directions or formatting, just output the spoken message exactly as it should be heard.**  
                Keep the script concise and under 30 seconds.`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedMessage = response.text();

        console.log("Generated phishing message:", generatedMessage);
        return res.status(200).json({ message: generatedMessage });

    } catch (error: any) {
        console.error("Error calling Google Gemini API:", error);
        return res.status(500).json({ error: "Failed to generate phishing Call" });
    }
}
