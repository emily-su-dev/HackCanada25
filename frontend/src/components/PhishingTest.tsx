import React, { useState } from "react";
import { generatePhishingCall, generatePhishingSms, sendSms, sendCall } from "../api/apiClient";

const PhishingTest = () => {
    const [employeeName, setEmployeeName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [phone, setPhone] = useState("");
    const [SMSmessage, setSMSMessage] = useState("");
    const [Callmessage, setCallMessage] = useState("");

    const handleGenerateSms = async () => {
        const phishingText = await generatePhishingSms(employeeName, companyName);
        if (phishingText) {
            setSMSMessage(phishingText);
        }
    };

    const handleSendSms = async () => {
        if (SMSmessage && phone) {
            const response = await sendSms(phone, SMSmessage);
            if (response) {
                alert("SMS Sent Successfully!");
            }
        }
    };

    const handleGenerateCall = async () => {
        const phishingText = await generatePhishingCall(employeeName, companyName);
        if (phishingText) {
            setCallMessage(phishingText);
        }
    };

    const handleSendCall = async () => {
        if (Callmessage && phone) {
            const response = await sendCall(phone, Callmessage);
            if (response) {
                alert("Call Sent Successfully!");
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
            <button onClick={handleGenerateSms}>Generate Phishing SMS</button>

            {SMSmessage && (
                <div>
                    <p><strong>Generated SMS:</strong> {SMSmessage}</p>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={handleSendSms}>Send as SMS</button>
                </div>
            )}

            <button onClick={handleGenerateCall}>Generate Phishing Call Message</button>

            {Callmessage && (
                <div>
                    <p><strong>Generated Call Message:</strong> {Callmessage}</p>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={handleSendCall}>Send a call</button>
                </div>
            )}
        </div>
    );
};

export default PhishingTest;
