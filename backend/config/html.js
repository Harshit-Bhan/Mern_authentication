const getAppName = () => process.env.APP_NAME || "Authentication App";

const getEmailShell = ({ title, appName, body }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${title}</title>
<style>
body {
margin: 0;
padding: 0;
background: #f6f7fb;
color: #111111;
-webkit-text-size-adjust: 100%;
-ms-text-size-adjust: 100%;
font-family: Arial, Helvetica, sans-serif;
}
table {
border-collapse: collapse;
}
</style>
</head>
<body style="margin:0;padding:0;background-color:#f6f7fb;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;background-color:#f6f7fb;">
<tr>
<td align="center" style="padding:24px;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e9ecf3;">
<tr>
<td align="center" style="background-color:#111827;padding:18px 24px;color:#ffffff;font-size:16px;font-weight:700;letter-spacing:0.3px;">
${appName}
</td>
</tr>
${body}
<tr>
<td align="center" style="padding:16px 24px 0 24px;font-size:12px;line-height:1.6;color:#6b7280;">
&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
</td>
</tr>
<tr>
<td height="16" aria-hidden="true"></td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

export const getOtpHtml = ({ email, otp }) => {
const appName = getAppName();

return getEmailShell({
title: `${appName} Verification Code`,
appName,
body: `<tr>
<td style="padding:32px 24px;">
<h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;color:#111111;font-weight:700;">Verify your email - ${email}</h1>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#444444;">
Use the verification code below to complete your sign-in to ${appName}.
</p>
<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="width:100%;margin:20px 0;">
<tr>
<td align="center" style="padding:0;">
<table role="presentation" border="0" cellspacing="0" cellpadding="0">
<tr>
<td style="background-color:#f3f4f6;border:1px solid #e5e7eb;padding:14px 18px;font-size:32px;letter-spacing:10px;font-weight:700;color:#111111;font-family:Arial, Helvetica, sans-serif;text-align:center;">
${otp}
</td>
</tr>
</table>
</td>
</tr>
</table>
<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#555555;">This code will expire in <strong>5 minutes</strong>.</p>
<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#555555;">If this wasn&apos;t initiated, this email can be safely ignored.</p>
</td>
</tr>`,
});
};

export const getVerifyEmailHtml = ({ email, token }) => {
const appName = getAppName();
const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/token/${encodeURIComponent(token)}`;

return getEmailShell({
title: `${appName} Verify Your Account`,
appName,
body: `<tr>
<td style="padding:32px 24px;">
<h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;color:#111111;font-weight:700;">Verify your account - ${email}</h1>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#444444;">
Thanks for registering with ${appName}. Click the button below to verify your account.
</p>
<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:16px 0 20px 0;">
<tr>
<td align="center">
<a href="${verifyUrl}" target="_blank" rel="noopener" style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;font-size:14px;font-weight:600;">Verify account</a>
</td>
</tr>
</table>
<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#555555;">
If the button doesn&apos;t work, copy and paste this link into your browser:
</p>
<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#555555;word-break:break-all;">
<a href="${verifyUrl}" target="_blank" rel="noopener" style="color:#111827;text-decoration:underline;">${verifyUrl}</a>
</p>
<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#555555;">
If this wasn&apos;t you, you can safely ignore this email.
</p>
</td>
</tr>`,
});
};
