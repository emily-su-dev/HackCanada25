import cors from "cors";
import { POST as sendSms } from './app/api/sms/route';
import { POST as sendCall } from './app/api/call/route';
import { POST as generatePhishingSms } from './app/api/aiSms/route';
import { POST as generatePhishingCall } from './app/api/aiCall/route';
import dotenv from 'dotenv';
import express from "express";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5100;

app.get("/", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// generate a phishing call message
app.post("/api/aiCall", async (req, res) => {
  await generatePhishingCall(req, res);
});

// generate a phishing SMS mesage
app.post("/api/aiSms", async (req, res) => {
  await generatePhishingSms(req, res);
});

// send an SMS message
app.post("/api/sms", async (req, res) => {
  try {
    console.log("Received request at /api/sms:", req.body);
    await sendSms(req);
    res.status(200).json({ message: "SMS sent successfully!" });
    console.log("Response sent: SMS sent successfully!");
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// send a phone call
app.post("/api/call", async (req, res) => {
  try {
    console.log("Received request at /api/call:", req.body);
    await sendCall(req);
    res.status(200).json({ message: "Call sent successfully!" });
    console.log("Response sent: Call sent successfully!");
  } catch (error) {
    console.error("Error sending Call:", error);
    res.status(500).json({ error: "Failed to send Call" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});
