import axios from "axios";

export const sendBrevoEmail = async (options) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        const supportEmail = process.env.SUPPORT_EMAIL;

        const url = "https://api.brevo.com/v3/smtp/email";

        const emailContent = {
            sender: {
                name: 'Your Project Admin', // Change as needed
                email: supportEmail
            },
            to: [
                {
                    email: options.email || "liblissz3@gmail.com",
                    name: options.name || "Admin"
                }
            ],
            subject: options.subject,
            htmlContent: options.html,
            // ADD THIS LINE BELOW - It solves the 'missing_parameter' error
            textContent: options.text || "New notification from your website."
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

// Add this line at the bottom to support the old name!
export const sendAdminNotification = sendBrevoEmail;