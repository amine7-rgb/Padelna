import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../services/api.js";
import { showToast } from "../../features/uiSlice.js";
import { getSiteCopy } from "../../data/siteContent.js";
import Reveal from "./Reveal.jsx";
import SectionTitle from "./SectionTitle.jsx";
import LoadingBall from "../ui/LoadingBall.jsx";
import Icon from "../ui/Icon.jsx";

const phoneCountries = [
  { code: "TN", labels: { en: "Tunisia", fr: "Tunisie" }, flagSrc: "/flags/tn.svg", dial: "+216" },
  { code: "DZ", labels: { en: "Algeria", fr: "Algerie" }, flagSrc: "/flags/dz.svg", dial: "+213" },
  { code: "MA", labels: { en: "Morocco", fr: "Maroc" }, flagSrc: "/flags/ma.svg", dial: "+212" },
  { code: "FR", labels: { en: "France", fr: "France" }, flagSrc: "/flags/fr.svg", dial: "+33" },
  { code: "ES", labels: { en: "Spain", fr: "Espagne" }, flagSrc: "/flags/es.svg", dial: "+34" },
  { code: "IT", labels: { en: "Italy", fr: "Italie" }, flagSrc: "/flags/it.svg", dial: "+39" },
  { code: "GB", labels: { en: "United Kingdom", fr: "Royaume-Uni" }, flagSrc: "/flags/gb.svg", dial: "+44" },
  { code: "US", labels: { en: "United States", fr: "Etats-Unis" }, flagSrc: "/flags/us.svg", dial: "+1" },
  { code: "AE", labels: { en: "United Arab Emirates", fr: "Emirats arabes unis" }, flagSrc: "/flags/ae.svg", dial: "+971" },
  { code: "QA", labels: { en: "Qatar", fr: "Qatar" }, flagSrc: "/flags/qa.svg", dial: "+974" }
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
  const language = useSelector((state) => state.ui.language);
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const countryPickerRef = useRef(null);
  const copy = getSiteCopy(language);
  const localizedCountries = useMemo(
    () =>
      phoneCountries.map((country) => ({
        ...country,
        label: country.labels[language] || country.labels.en
      })),
    [language]
  );
  const selectedCountry = useMemo(
    () => localizedCountries.find((country) => country.code === form.phoneCountry) || localizedCountries[0],
    [form.phoneCountry, localizedCountries]
  );

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleCountrySelect = (countryCode) => {
    setForm((current) => ({ ...current, phoneCountry: countryCode }));
    setCountryMenuOpen(false);
  };

  useEffect(() => {
    if (!countryMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!countryPickerRef.current?.contains(event.target)) {
        setCountryMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setCountryMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [countryMenuOpen]);

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
      dispatch(showToast({ type: "success", message: copy.contact.sentToast }));
    } catch (error) {
      dispatch(showToast({ type: "error", message: error.message }));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <Reveal>
        <SectionTitle eyebrow={copy.contact.eyebrow} title={copy.contact.title} copy={copy.contact.copy} />
      </Reveal>

      <Reveal className="contact-layout">
        <form className={`contact-form-card ${sending ? "loading-surface" : ""}`} onSubmit={handleSubmit}>
          {sending ? (
            <div className="loading-surface-overlay">
              <LoadingBall label={copy.contact.sendingOverlay} variant="overlay" />
            </div>
          ) : null}

          <label>
            {copy.contact.name}
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            {copy.contact.email}
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="wide">
            {copy.contact.phoneNumber}
            <div className="phone-field">
              <div className="phone-country-picker" ref={countryPickerRef}>
                <button
                  type="button"
                  className={`phone-country-trigger ${countryMenuOpen ? "open" : ""}`}
                  onClick={() => setCountryMenuOpen((current) => !current)}
                  aria-haspopup="listbox"
                  aria-expanded={countryMenuOpen}
                  aria-label={copy.contact.countryCode}
                >
                  <img className="phone-country-flag-image" src={selectedCountry.flagSrc} alt="" aria-hidden="true" />
                  <span className="phone-country-name">{selectedCountry.label}</span>
                  <span className="phone-country-dial">{selectedCountry.dial}</span>
                  <span className="phone-country-chevron" aria-hidden="true" />
                </button>
                {countryMenuOpen ? (
                  <div className="phone-country-menu" role="listbox" aria-label={copy.contact.countryCode}>
                    {localizedCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        role="option"
                        aria-selected={country.code === form.phoneCountry}
                        className={`phone-country-option ${country.code === form.phoneCountry ? "active" : ""}`}
                        onClick={() => handleCountrySelect(country.code)}
                      >
                        <img className="phone-country-flag-image" src={country.flagSrc} alt="" aria-hidden="true" />
                        <span className="phone-country-name">{country.label}</span>
                        <span className="phone-country-dial">{country.dial}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <input
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder={copy.contact.phonePlaceholder}
              />
            </div>
          </label>

          <label className="wide">
            {copy.contact.message}
            <textarea name="message" rows="6" value={form.message} onChange={handleChange} required />
          </label>

          <div className="form-action-row wide center">
            <button type="submit" className="primary-button compact-action-button" disabled={sending}>
              {sending ? (
                <LoadingBall label={copy.contact.sendingInline} variant="inline" />
              ) : (
                <>
                  <Icon name="send" />
                  {copy.contact.sendRequest}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="contact-side-card">
          <span>{copy.contact.why}</span>
          <strong>{copy.contact.whyTitle}</strong>
          <p>{copy.contact.whyCopy}</p>
          <ul>
            <li>{copy.contact.bulletOne}</li>
            <li>{copy.contact.bulletTwo}</li>
            <li>{copy.contact.bulletThree}</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export default ContactSection;
