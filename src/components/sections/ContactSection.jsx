import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../services/api.js";
import { showToast } from "../../features/uiSlice.js";
import Reveal from "./Reveal.jsx";
import SectionTitle from "./SectionTitle.jsx";
import LoadingBall from "../ui/LoadingBall.jsx";
import Icon from "../ui/Icon.jsx";

const phoneCountries = [
  { code: "TN", label: "Tunisia", flag: "🇹🇳", dial: "+216" },
  { code: "DZ", label: "Algeria", flag: "🇩🇿", dial: "+213" },
  { code: "MA", label: "Morocco", flag: "🇲🇦", dial: "+212" },
  { code: "FR", label: "France", flag: "🇫🇷", dial: "+33" },
  { code: "ES", label: "Spain", flag: "🇪🇸", dial: "+34" },
  { code: "IT", label: "Italy", flag: "🇮🇹", dial: "+39" },
  { code: "GB", label: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "US", label: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "AE", label: "United Arab Emirates", flag: "🇦🇪", dial: "+971" },
  { code: "QA", label: "Qatar", flag: "🇶🇦", dial: "+974" }
];

const initialForm = {
  name: "",
  email: "",
  phoneCountry: "TN",
  phoneNumber: "",
  message: ""
};

function ContactSection() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const selectedCountry = useMemo(
    () => phoneCountries.find((country) => country.code === form.phoneCountry) || phoneCountries[0],
    [form.phoneCountry]
  );

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);

    try {
      await api.submitContact({
        name: form.name,
        email: form.email,
        phoneCountry: selectedCountry.label,
        phoneCode: selectedCountry.dial,
        phoneNumber: form.phoneNumber,
        phone: form.phoneNumber ? `${selectedCountry.dial} ${form.phoneNumber}` : "",
        message: form.message
      });
      setForm(initialForm);
      dispatch(showToast({ type: "success", message: "Your message has been sent to Padelna." }));
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
          title="Let’s talk about your order, club or collaboration."
          copy="This form uses the same destination inbox as your portfolio, with MongoDB storage when the database is configured."
        />
      </Reveal>

      <Reveal className="contact-layout">
        <form className={`contact-form-card ${sending ? "loading-surface" : ""}`} onSubmit={handleSubmit}>
          {sending ? (
            <div className="loading-surface-overlay">
              <LoadingBall label="Sending your message..." variant="overlay" />
            </div>
          ) : null}

          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Country code
            <select name="phoneCountry" value={form.phoneCountry} onChange={handleChange}>
              {phoneCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {`${country.flag} ${country.label} (${country.dial})`}
                </option>
              ))}
            </select>
          </label>

          <label>
            Phone number
            <div className="phone-field">
              <span className="phone-prefix">{selectedCountry.dial}</span>
              <input
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="55 770 126"
              />
            </div>
          </label>

          <label className="wide">
            Message
            <textarea name="message" rows="6" value={form.message} onChange={handleChange} required />
          </label>

          <div className="form-action-row wide center">
            <button type="submit" className="primary-button compact-action-button" disabled={sending}>
              {sending ? (
                <LoadingBall label="Sending..." variant="inline" />
              ) : (
                <>
                  <Icon name="send" />
                  Send request
                </>
              )}
            </button>
          </div>
        </form>

        <div className="contact-side-card">
          <span>Why contact us?</span>
          <strong>For apparel drops, club kits, collaborations or direct support.</strong>
          <p>
            Padelna is ready to grow into a full e-commerce experience with catalog management, reviews, cart flow and
            future checkout.
          </p>
          <ul>
            <li>Same contact email as your portfolio</li>
            <li>MongoDB storage for every request</li>
            <li>Ready for payments, auth and an admin dashboard later</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export default ContactSection;
