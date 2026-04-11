import { useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../services/api.js";
import { showToast } from "../../features/uiSlice.js";
import Reveal from "./Reveal.jsx";
import SectionTitle from "./SectionTitle.jsx";
import LoadingBall from "../ui/LoadingBall.jsx";

const initialForm = {
  name: "",
  email: "",
  company: "",
  budget: "",
  message: ""
};

function ContactSection() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);

    try {
      await api.submitContact(form);
      setForm(initialForm);
      dispatch(showToast({ type: "success", message: "Message envoye a Padelna avec succes." }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <Reveal>
        <SectionTitle
          eyebrow="Contact"
          title="Parlons de votre commande, de votre club ou de votre collaboration."
          copy="Le formulaire utilise la meme destination email que votre portfolio, avec sauvegarde MongoDB si la base est configuree."
        />
      </Reveal>

      <Reveal className="contact-layout">
        <form className={`contact-form-card ${sending ? "loading-surface" : ""}`} onSubmit={handleSubmit}>
          {sending ? (
            <div className="loading-surface-overlay">
              <LoadingBall label="Envoi du message..." variant="overlay" />
            </div>
          ) : null}
          <label>
            Nom
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Club / entreprise
            <input name="company" value={form.company} onChange={handleChange} />
          </label>
          <label>
            Budget
            <select name="budget" value={form.budget} onChange={handleChange}>
              <option value="">Choisir une fourchette</option>
              <option value="Drop capsule">Drop capsule</option>
              <option value="Stock complet">Stock complet</option>
              <option value="Partenariat club">Partenariat club</option>
            </select>
          </label>
          <label className="wide">
            Message
            <textarea name="message" rows="6" value={form.message} onChange={handleChange} required />
          </label>
          <button type="submit" className="primary-button wide" disabled={sending}>
            {sending ? <LoadingBall label="Envoi..." variant="inline" /> : "Envoyer la demande"}
          </button>
        </form>

        <div className="contact-side-card">
          <span>Pourquoi nous contacter ?</span>
          <strong>Pour une marque, un club, une commande ou un drop sur mesure.</strong>
          <p>
            Padelna peut servir de base a une vraie boutique en ligne avec catalogue, avis, panier et gestion des
            demandes commerciales.
          </p>
          <ul>
            <li>Meme email de contact que votre portfolio</li>
            <li>MongoDB pour enregistrer les messages</li>
            <li>Base prete pour ajouter paiement, auth et dashboard admin</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export default ContactSection;
