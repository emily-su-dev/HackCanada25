import axios from "axios";

const API_BASE_URL = "http://localhost:5100/api";

// Call backend to generate phishing SMS
export const generatePhishingSms = async (employeeName: string, companyName: string, employeePosition: string): Promise<string | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/aiSms`, { employeeName, companyName, employeePosition});
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

// Call backend to generate phishing SMS
export const generatePhishingCall = async (employeeName: string, companyName: string, employeePosition: string): Promise<string | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/aiCall`, { employeeName, companyName, employeePosition });
        return response.data.message;
    } catch (error) {
        console.error("Error generating phishing SMS:", error);
        return null;
    }
};

// Send the phishing message as a phone call
export const sendCall = async (to: string, body: string): Promise<any | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/call`, { to, body });
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error);
        return null;
    }
};
