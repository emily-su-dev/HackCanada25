import axios from "axios";

const API_BASE_URL = "http://localhost:5100/api";

// Call backend to generate phishing SMS
export const generatePhishingSms = async (employeeName: string, companyName: string): Promise<string | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ai`, { employeeName, companyName });
        return response.data.message;
    } catch (error) {
        console.error("Error generating phishing SMS:", error);
        return null;
    }
};

// Send the phishing message as an SMS
export const sendSms = async (to: string, body: string): Promise<any | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sms`, { to, body });
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error);
        return null;
    }
};
