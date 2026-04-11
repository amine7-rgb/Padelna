import { brand } from "../../data/brand.js";

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
          <span>Contact direct</span>
          <strong>{brand.email}</strong>
          <p>
            Meme logique de contact que votre portfolio, mais adaptee a la boutique Padelna pour les demandes
            clients, collaborations et clubs.
          </p>
          <a href={`mailto:${brand.email}`}>Ecrire a Padelna</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          {brand.name} {brand.founded} | Marque de vetements de padel creee en Tunisie pour le sport, le style et
          la performance.
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

