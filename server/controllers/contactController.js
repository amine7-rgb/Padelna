import { Contact } from "../models/Contact.js";
import { createMailer, formatContactHtml, formatContactText } from "../utils/mailer.js";
import { isMongoConnected } from "../config/db.js";

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const sendContactMessage = async (req, res) => {
  const { name, email, phone, phoneCountry, phoneCode, phoneNumber, company, budget, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  let savedContact = null;
  let delivered = false;
  const contactToEmail = process.env.CONTACT_TO_EMAIL || "amed14170@gmail.com";

  if (isMongoConnected()) {
    savedContact = await Contact.create({
      name,
      email,
      phone,
      phoneCountry,
      phoneCode,
      phoneNumber,
      company,
      budget,
      message
    });
  }

  const mailer = createMailer();

  if (mailer) {
    await mailer.sendMail({
      from: `"Palina Contact" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: contactToEmail,
      subject: `New Palina contact from ${name}`,
      text: formatContactText({ name, email, phone, phoneCountry, phoneCode, phoneNumber, company, budget, message }),
      html: formatContactHtml({ name, email, phone, phoneCountry, phoneCode, phoneNumber, company, budget, message })
    });

    delivered = true;
  }

  if (!savedContact && !delivered) {
    return res.status(503).json({
      error: "The contact service is not configured. Add MongoDB or SMTP in .env."
    });
  }

  return res.status(201).json({ ok: true, id: savedContact?._id || null, delivered });
};
