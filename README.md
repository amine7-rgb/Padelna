# Padelna Storefront

Padelna est une base e-commerce MERN pour une marque de vetements de padel.

## Stack

- React + Vite
- Redux Toolkit
- React Router
- Node.js + Express
- MongoDB + Mongoose
- Nodemailer pour le formulaire de contact

## Scripts

- `npm run dev` lance le front et l'API
- `npm run build` build le front
- `npm run start` lance l'API en mode production
- `npm run seed` injecte les produits de demonstration dans MongoDB

## Variables d'environnement

Copiez `.env.example` vers `.env` puis configurez:

- `MONGODB_URI`
- `CONTACT_TO_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`

## Fonctionnalites

- hero carousel avec slogans typing
- presentation de marque Padelna
- boutique avec multi-filtres avances
- panier Redux
- favoris Redux
- pages produit detaillees
- avis clients et ajout de review
- section nouveautes
- formulaire de contact relie a MongoDB et au meme email que votre portfolio

