import React, { useState } from "react";
import { generatePhishingCall, generatePhishingSms, sendSms, sendCall } from "../api/apiClient";

const PhishingTest = () => {
    const [employeeName, setEmployeeName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [employeePosition, setEmployeePosition] = useState("");
    const [phone, setPhone] = useState("");
    const [SMSmessage, setSMSMessage] = useState("");
    const [callMessage, setCallMessage] = useState("");

    const handleGenerateSms = async () => {
        const phishingText = await generatePhishingSms(employeeName, companyName, employeePosition);
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
        const phishingText = await generatePhishingCall(employeeName, companyName, employeePosition);
        if (phishingText) {
            setCallMessage(phishingText);
        }
    };

    const handleSendCall = async () => {
        if (callMessage && phone) {
            const response = await sendCall(phone, callMessage);
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
            <input
                type="text"
                placeholder="Enter employee position"
                value={employeePosition}
                onChange={(e) => setEmployeePosition(e.target.value)}
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

            {callMessage && (
                <div>
                    <p><strong>Generated Call Message:</strong> {callMessage}</p>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={handleSendCall}>Send as call</button>
                </div>
            )}
        </div>
    );
};

export default PhishingTest;
