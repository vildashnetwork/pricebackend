import axios from "axios";

/**
 * Global Email Utility using Brevo API
 * @param {Object} options - { email, name, subject, html, text }
 */
export const sendAdminNotification = async (options) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        const url = "https://api.brevo.com/v3/smtp/email";

        const emailContent = {
            sender: {
                name: 'TimberTrade Admin',
                email: process.env.SUPPORT_EMAIL // Must be verified in Brevo
            },
            to: [
                {
                    email: "liblissz3@gmail.com",
                    name: "Admin"
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
        throw error; // Throw so the controller can catch it if needed
    }
};