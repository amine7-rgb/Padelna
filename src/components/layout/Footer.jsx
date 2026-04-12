import { useSelector } from "react-redux";
import Icon from "../ui/Icon.jsx";
import { getBrandContent } from "../../data/brand.js";
import { getSiteCopy } from "../../data/siteContent.js";

function Footer() {
  const language = useSelector((state) => state.ui.language);
  const brand = getBrandContent(language);
  const copy = getSiteCopy(language);
  const connectItems = [
    {
      key: "instagram",
      icon: "instagram",
      label: copy.footer.instagram,
      value: brand.instagramHandle,
      href: brand.instagramUrl,
      external: true
    },
    {
      key: "tiktok",
      icon: "tiktok",
      label: copy.footer.tiktok,
      value: brand.tiktokHandle,
      href: brand.tiktokUrl,
      external: true
    },
    {
      key: "email",
      icon: "mail",
      label: copy.footer.email,
      value: brand.email,
      href: `mailto:${brand.email}`,
      external: false
    },
    {
      key: "phone",
      icon: "phone",
      label: copy.footer.phone,
      value: brand.phone,
      href: `tel:${brand.phone.replace(/\s+/g, "")}`,
      external: false
    }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-card footer-brand-showcase">
          <div className="footer-logo-shell">
            <span className="footer-logo-glow" aria-hidden="true" />
            <img src="/logo-padelna.svg" alt={`${brand.name} logo`} />
          </div>
          <div className="footer-brand-copy">
            <p className="footer-kicker">{copy.footer.kicker}</p>
            <h2>{brand.tagline}</h2>
            <p>{brand.shortCopy}</p>
          </div>
        </div>

        <div className="footer-contact-card footer-connect-card">
          <span>{copy.footer.connect}</span>
          <strong>{copy.footer.direct}</strong>
          <p>{copy.footer.copy}</p>
          <div className="footer-connect-grid">
            {connectItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="footer-connect-link"
                {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span className="footer-connect-icon">
                  <Icon name={item.icon} />
                </span>
                <span className="footer-connect-copy">
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom footer-bottom-centered">
        <p>{brand.name} {brand.founded} | {copy.footer.bottom}</p>
      </div>
    </footer>
  );
}

export default Footer;
