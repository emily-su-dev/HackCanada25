import React, { useState } from "react";
import { generatePhishingSms, sendSms } from "../api/apiClient";

const PhishingTest = () => {
    const [employeeName, setEmployeeName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const handleGenerate = async () => {
        const phishingText = await generatePhishingSms(employeeName, companyName);
        if (phishingText) {
            setMessage(phishingText);
        }
    };

    const handleSendSms = async () => {
        if (message && phone) {
            const response = await sendSms(phone, message);
            if (response) {
                alert("SMS Sent Successfully!");
            }
        }
    };

    return (
        <div>
            <h2>Phishing Test</h2>
            <input 
                type="text" 
                placeholder="Enter employee name" 
                value={employeeName} 
                onChange={(e) => setEmployeeName(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Enter company name" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
            />
            <button onClick={handleGenerate}>Generate Phishing SMS</button>

            {message && (
                <div>
                    <p><strong>Generated SMS:</strong> {message}</p>
                    <input 
                        type="text" 
                        placeholder="Enter phone number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                    <button onClick={handleSendSms}>Send as SMS</button>
                </div>
            )}
        </div>
    );
};

export default PhishingTest;
