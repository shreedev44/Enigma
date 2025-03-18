export function otpPage(otp: string) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        }
        .email-container {
        max-width: 700px;
        margin: 50px auto;
        background: #ffffff;
        border-radius: 15px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        }
        .header {
        background-color: #000;
        color: white;
        text-align: center;
        padding: 30px;
        font-size: 32px;
        font-weight: bold;
        }
        .body {
        padding: 30px;
        color: #333;
        font-size: 20px;
        line-height: 1.8;
        }
        .otp-box {
        margin: 30px auto;
        padding: 20px 30px;
        background-color: #f1f1f1;
        border: 3px dashed #000;
        text-align: center;
        font-size: 36px;
        font-weight: bold;
        color: #000;
        letter-spacing: 12px;
        width: fit-content;
        border-radius: 10px;
        }
        .cta-button {
        display: block;
        margin: 40px auto 0;
        padding: 20px 30px;
        background-color: #000;
        color: white;
        text-decoration: none;
        font-size: 20px;
        font-weight: bold;
        border-radius: 10px;
        text-align: center;
        width: fit-content;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .cta-button:hover {
        background-color: #333;
        }
        .footer {
        text-align: center;
        color: #888;
        padding: 20px 30px;
        font-size: 16px;
        border-top: 1px solid #eee;
        background-color: #f7f7f7;
        }
        .footer a {
        color: #000;
        text-decoration: none;
        font-weight: bold;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
        .email-container {
            margin: 20px;
        }
        .header {
            font-size: 28px;
            padding: 20px;
        }
        .body {
            padding: 20px;
            font-size: 18px;
        }
        .otp-box {
            font-size: 28px;
            padding: 15px 20px;
            letter-spacing: 8px;
        }
        .cta-button {
            font-size: 18px;
            padding: 15px 20px;
        }
        .footer {
            font-size: 14px;
            padding: 15px 20px;
        }
        }

        @media (max-width: 480px) {
        .header {
            font-size: 24px;
            padding: 15px;
        }
        .body {
            font-size: 16px;
            padding: 15px;
        }
        .otp-box {
            font-size: 24px;
            letter-spacing: 6px;
            padding: 10px 15px;
        }
        .cta-button {
            font-size: 16px;
            padding: 10px 15px;
        }
        .footer {
            font-size: 12px;
            padding: 10px 15px;
        }
        }
    </style>
    </head>
    <body>
    <div class="email-container">
        <div class="header">
        Enigma
        </div>
        <div class="body">
        <p>Hello,</p>
        <p>We received a request to register your account in Enigma. Use the one-time password (OTP) below to complete the process. This OTP is valid for the next 10 minutes.</p>
        <div class="otp-box">
            ${otp}
        </div>
        <p>If you did not make this request, please ignore this email or contact support if you have any concerns.</p>
        </div>
        <div class="footer">
        <p>&copy; 2025 Enigma. All rights reserved.</p>
        </div>
    </div>
    </body>
    </html>`
}
