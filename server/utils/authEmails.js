import fs from "node:fs";
import path from "node:path";
import { createMailer } from "./mailer.js";
import { getClientOrigin } from "./auth.js";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getLogoAttachments = () => {
  const logoPath = path.resolve(process.cwd(), "public", "logo-padelna.svg");

  if (!fs.existsSync(logoPath)) {
    return [];
  }

  return [{ filename: "logo-padelna.svg", path: logoPath, cid: "padelna-logo" }];
};

const getFromEmail = () => `"Padelna Auth" <${process.env.SMTP_USER}>`;

const renderMailLayout = ({ eyebrow, title, intro, buttonLabel, buttonUrl, footer }) => `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#071528;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#071528;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #d6e0ee;">
            <tr>
              <td style="padding:30px 32px;background:linear-gradient(135deg,#102d73,#071528);">
                <img src="cid:padelna-logo" alt="Padelna" style="display:block;width:210px;max-width:100%;height:auto;" />
                <p style="margin:22px 0 10px;color:#83f6e4;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;">${escapeHtml(
                  eyebrow
                )}</p>
                <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:1.2;">${escapeHtml(title)}</h1>
                <p style="margin:14px 0 0;color:#dce7ff;font-size:15px;line-height:1.75;">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 32px;color:#11213e;">
                <a href="${escapeHtml(buttonUrl)}" style="display:inline-block;background:#173f99;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:14px;font-size:15px;font-weight:800;">${escapeHtml(
                  buttonLabel
                )}</a>
                <p style="margin:20px 0 0;color:#5c7090;font-size:14px;line-height:1.8;">If the button does not open, use this link:</p>
                <p style="margin:8px 0 0;word-break:break-all;"><a href="${escapeHtml(buttonUrl)}" style="color:#173f99;text-decoration:none;">${escapeHtml(
                  buttonUrl
                )}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#eef4ff;color:#5f7392;font-size:13px;">${escapeHtml(footer)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const sendVerificationEmail = async (user, token) => {
  const mailer = createMailer();

  if (!mailer) {
    return false;
  }

  const verifyUrl = `${getClientOrigin()}/verify-email?token=${encodeURIComponent(token)}`;

  await mailer.sendMail({
    from: getFromEmail(),
    to: user.email,
    subject: "Verify your Padelna account",
    text: `Verify your Padelna account: ${verifyUrl}`,
    html: renderMailLayout({
      eyebrow: "Padelna account",
      title: "Verify your email address.",
      intro: "Confirm your email to secure your Padelna account and keep your orders and deliveries connected to the right inbox.",
      buttonLabel: "Verify my email",
      buttonUrl: verifyUrl,
      footer: "Padelna account security and order access."
    }),
    attachments: getLogoAttachments()
  });

  return true;
};

export const sendResetPasswordEmail = async (user, token) => {
  const mailer = createMailer();

  if (!mailer) {
    return false;
  }

  const resetUrl = `${getClientOrigin()}/reset-password?token=${encodeURIComponent(token)}`;

  await mailer.sendMail({
    from: getFromEmail(),
    to: user.email,
    subject: "Reset your Padelna password",
    text: `Reset your Padelna password: ${resetUrl}`,
    html: renderMailLayout({
      eyebrow: "Padelna security",
      title: "Reset your password.",
      intro: "Use the secure link below to choose a new password for your Padelna account.",
      buttonLabel: "Reset password",
      buttonUrl: resetUrl,
      footer: "If you did not request this change, you can ignore this email."
    }),
    attachments: getLogoAttachments()
  });

  return true;
};
