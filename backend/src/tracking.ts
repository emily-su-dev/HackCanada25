import crypto from "crypto";

export function generateTrackingLink(email: string): string {
    const uid = crypto.createHash("sha256").update(email).digest("hex").substring(0, 10);
    return `http://localhost:3000/click?uid=${uid}`;
}
