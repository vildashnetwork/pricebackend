import axios from "axios";

/**
 * Universal Email Utility
 * @param {Object} options - { email, name, subject, html, text }
 */
export const sendBrevoEmail = async (options) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        const url = "https://api.brevo.com/v3/smtp/email";

        const emailContent = {
            sender: {
                name: 'TimberTrade',
                email: process.env.SUPPORT_EMAIL
            },
            to: [
                {
                    // Use the email passed in options, or fallback to yours if none provided
                    email: options.email || "liblissz3@gmail.com",
                    name: options.name || "User"
                }
            ],
            subject: options.subject,
            htmlContent: options.html,
            textContent: options.text || ''
        };

        const response = await axios.post(url, emailContent, {
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error('Email Utility Error:', error.response?.data || error.message);
        throw error;
    }
};