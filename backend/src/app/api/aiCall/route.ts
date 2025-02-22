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
        const { employeeName, companyName } = data;

        if (!employeeName || !companyName) {
            console.error("Missing required parameters.");
            return res.status(400).json({ error: "Employee name and company name are required." });
        }

        // Generate text using Google Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are generating a simulated security awareness training call script for employees at ${companyName}.  
The script should sound like a **real automated call** from a company representative or security system.  
Address the recipient as ${employeeName} and inform them of an urgent account-related issue.  
Encourage them to take immediate action by visiting https://${companyName}.ca/verify${employeeName} or calling a support number.  
🚨 **Do NOT include stage directions or formatting, just output the spoken message exactly as it should be heard.**  
Keep the script concise and under 30 seconds.`;

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
