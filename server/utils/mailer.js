import nodemailer from "nodemailer";

const env = (key, fallback = "") => (process.env[key] || fallback).trim();

export const createMailer = () => {
  const host = env("SMTP_HOST");
  const port = env("SMTP_PORT");
  const secure = env("SMTP_SECURE");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: secure === "true",
    auth: { user, pass }
  });
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatPhoneLine = ({ phone, phoneCountry, phoneCode, phoneNumber }) => {
  if (phone) {
    return phone;
  }

  if (phoneNumber && phoneCode) {
    return `${phoneCode} ${phoneNumber}`;
  }

  if (phoneCountry || phoneNumber) {
    return [phoneCountry, phoneCode, phoneNumber].filter(Boolean).join(" ");
  }

  return "Not provided";
};

export const formatContactText = ({ name, email, phone, phoneCountry, phoneCode, phoneNumber, message }) => `
New Palina contact request

Name: ${name}
Email: ${email}
Phone: ${formatPhoneLine({ phone, phoneCountry, phoneCode, phoneNumber })}

Message:
${message}
`;

export const formatContactHtml = ({ name, email, phone, phoneCountry, phoneCode, phoneNumber, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(formatPhoneLine({ phone, phoneCountry, phoneCode, phoneNumber }));
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#071528;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#071528;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #dbe3ef;">
            <tr>
              <td style="padding:32px;background:linear-gradient(135deg,#123f9b,#091a41);">
                <p style="margin:0 0 10px;color:#90ffe8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Palina Contact</p>
                <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:1.18;">New website request</h1>
                <p style="margin:14px 0 0;color:#dbe7ff;font-size:15px;line-height:1.7;">A visitor just sent a message from the Palina e-commerce website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 12px;color:#15233f;">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#123f9b;text-decoration:none;">${safeEmail}</a></p>
                <p><strong>Phone:</strong> ${safePhone}</p>
                <div style="margin-top:22px;padding:20px;border-radius:16px;background:#f5f7fb;border:1px solid #d9e2f2;">
                  <p style="margin:0 0 8px;color:#587095;font-size:12px;font-weight:700;text-transform:uppercase;">Message</p>
                  <p style="margin:0;color:#15233f;font-size:16px;line-height:1.8;">${safeMessage}</p>
                </div>
                <div style="padding-top:22px;">
                  <a href="mailto:${safeEmail}" style="display:inline-block;background:#123f9b;color:#ffffff;text-decoration:none;padding:13px 18px;border-radius:12px;font-size:15px;font-weight:700;">Reply to sender</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#eff4ff;color:#5a6f90;font-size:13px;">Sent from Palina. Same destination inbox as the portfolio: amed14170@gmail.com.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
