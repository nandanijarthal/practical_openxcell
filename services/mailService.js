const nodemailer = require('nodemailer');
const dontenv = require('dotenv').config();

let mails = {

    sendMail: async (data) => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user: process.env.email_id,
                pass: process.env.email_pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const output = `
        <h1>Welcome to pratical demo.</h1>
        `;
        let mailOptions = {
            from: process.env.email_id,
            to: data.to_email,
            subject: data.subject,
            html: output
        };

        let info = await transporter.sendMail(mailOptions);
        return info;
    }
};

module.exports = mails;