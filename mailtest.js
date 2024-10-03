const { EmailClient } = require("@azure/communication-email");
const { PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE,SIGNUP_SUCCESS_TEMPLATE} = require("./email-templates/templates");
const dotenv = require("dotenv");
dotenv.config();
const connectionString = process.env.SMTP_CONNECTION_URL
const client = new EmailClient(connectionString);
function getCurrentFormattedDateTime() {
    const now = new Date();
    
    // Options to format the date and time
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    // Format the date-time
    return now.toLocaleString('en-US', options);
}
async function mailSenderWorker(
    email = "", 
    verificationToken = "", 
    mailType = ""
) {
    if (!email || !mailType) {
        throw new Error("Email and mailType are required parameters.");
    }

    let emailMessage;
    const formattedDateTime = getCurrentFormattedDateTime();
    if (mailType === 'resetSuccess') {
        // Clone the template to avoid modifying the original template
        const emailTemplate = PASSWORD_RESET_SUCCESS_TEMPLATE;
        emailMessage = {
            senderAddress: process.env.SENDER_EMAIL,
            content: {
                subject: `Password Reset Success at${formattedDateTime}`,
                html: emailTemplate // No replacements needed for this case
            },
            recipients: {
                to: [{ address: email }],
            },
        };
    } else if (mailType === 'signupsuccess') {
        const emailTemplate = SIGNUP_SUCCESS_TEMPLATE;
        emailMessage = {
            senderAddress: process.env.SENDER_EMAIL,
            content: {
                subject: `Registered successfully ${formattedDateTime}`,
                html: emailTemplate.replace("{userName}", verificationToken)
            },
            recipients: {
                to: [{ address: email }],
            },
        };

    }
    else if (mailType === 'verifyEmail') {
        // Clone the template to avoid modifying the original template
        let emailTemplate = VERIFICATION_EMAIL_TEMPLATE;
        emailMessage = {
            senderAddress: process.env.SENDER_EMAIL,
            content: {
                subject: `Verify your Email ${formattedDateTime}`,
                html: emailTemplate.replace("{verificationCode}", verificationToken)
            },
            recipients: {
                to: [{ address: email }],
            },
        };
    } else if (mailType === "resetPassword") {
        // Clone the template to avoid modifying the original template
        let emailTemplate = PASSWORD_RESET_REQUEST_TEMPLATE;
        emailMessage = {
            senderAddress: process.env.SENDER_EMAIL,
            content: {
                subject: `Password Reset Request at ${formattedDateTime}`,
                html: emailTemplate.replace("{otp}", verificationToken)
            },
            recipients: {
                to: [{ address: email }],
            },
        };
    } else {
        throw new Error("Invalid mail type");
    }

    const poller = await client.beginSend(emailMessage);
    // const result = await poller.pollUntilDone();
}

module.exports = mailSenderWorker;
