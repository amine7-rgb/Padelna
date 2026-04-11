import { brand } from "../../data/brand.js";
import Icon from "../ui/Icon.jsx";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-card">
          <img src="/logo-padelna.svg" alt={`${brand.name} logo`} />
          <div>
            <p className="footer-kicker">Padelna Tunisia</p>
            <h2>{brand.tagline}</h2>
            <p>{brand.shortCopy}</p>
          </div>
        </div>

        <div className="footer-contact-card">
          <span>Direct contact</span>
          <strong>{brand.email}</strong>
          <p>
            The same inbox as your portfolio, now adapted for customer requests, clubs and brand collaborations.
          </p>
          <a href={`mailto:${brand.email}`}>
            <Icon name="mail" />
            Email Padelna
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          {brand.name} {brand.founded} | Tunisian padel apparel made for performance, style and movement.
        </p>
        <div className="footer-links">
          {brand.footerLinks.map((link) => (
            <a key={link.label} href={link.href}>
              <span>{link.label}</span>
              <strong>{link.value}</strong>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
