import { Contact } from "../models/Contact.js";
import { createMailer, formatContactHtml, formatContactText } from "../utils/mailer.js";
import { isMongoConnected } from "../config/db.js";

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const sendContactMessage = async (req, res) => {
  const { name, email, company, budget, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Nom, email et message sont obligatoires." });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: "Veuillez fournir un email valide." });
  }

  let savedContact = null;
  let delivered = false;
  const contactToEmail = process.env.CONTACT_TO_EMAIL || "amed14170@gmail.com";

  if (isMongoConnected()) {
    savedContact = await Contact.create({ name, email, company, budget, message });
  }

  const mailer = createMailer();

  if (mailer) {
    await mailer.sendMail({
      from: `"Padelna Contact" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: contactToEmail,
      subject: `New Padelna contact from ${name}`,
      text: formatContactText({ name, email, company, budget, message }),
      html: formatContactHtml({ name, email, company, budget, message })
    });

    delivered = true;
  }

  if (!savedContact && !delivered) {
    return res.status(503).json({
      error: "Le service de contact n'est pas configure. Ajoutez MongoDB ou SMTP dans .env."
    });
  }

  return res.status(201).json({ ok: true, id: savedContact?._id || null, delivered });
};

