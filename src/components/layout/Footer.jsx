import { useSelector } from "react-redux";
import Icon from "../ui/Icon.jsx";
import { getBrandContent } from "../../data/brand.js";
import { getSiteCopy } from "../../data/siteContent.js";

function Footer() {
  const language = useSelector((state) => state.ui.language);
  const brand = getBrandContent(language);
  const copy = getSiteCopy(language);

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-card">
          <img src="/logo-padelna.svg" alt={`${brand.name} logo`} />
          <div>
            <p className="footer-kicker">{copy.footer.kicker}</p>
            <h2>{brand.tagline}</h2>
            <p>{brand.shortCopy}</p>
          </div>
        </div>

        <div className="footer-contact-card">
          <span>{copy.footer.direct}</span>
          <strong>{brand.email}</strong>
          <p>{copy.footer.copy}</p>
          <a href={`mailto:${brand.email}`}>
            <Icon name="mail" />
            {copy.footer.email}
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{brand.name} {brand.founded} | {copy.footer.bottom}</p>
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
