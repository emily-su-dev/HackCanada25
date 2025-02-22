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

        const prompt = `Generate a realistic SMS message for a security training exercise at ${companyName}.  
The message should be urgent and encourage ${employeeName} to take action, such as verifying an account or clicking a link (specifically https://${companyName}.ca/verify${employeeName}).  
It should resemble common security alerts or account notifications, keeping it professional and under 160 characters.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedMessage = response.text();

        console.log("Generated phishing message:", generatedMessage);
        return res.status(200).json({ message: generatedMessage });

    } catch (error: any) {
        console.error("Error calling Google Gemini API:", error);
        return res.status(500).json({ error: "Failed to generate phishing SMS" });
    }
}
