const categoryLabels = {
  Matchwear: { en: "Matchwear", fr: "Matchwear" },
  Training: { en: "Training", fr: "Training" },
  Outerwear: { en: "Outerwear", fr: "Outerwear" }
};

const genderLabels = {
  Men: { en: "Men", fr: "Homme" },
  Women: { en: "Women", fr: "Femme" },
  Unisex: { en: "Unisex", fr: "Unisexe" }
};

const frenchProducts = {
  "carthage-match-polo": {
    summary: "Un polo leger et net pour des points explosifs sous le soleil tunisien.",
    description:
      "Carthage Match Polo combine un tissu respirant, des manches souples et une coupe stable pour garder le haut du corps libre dans toutes les phases de jeu. C'est une piece signature pour les joueurs qui veulent rester precis sur le court tout en gardant une allure premium au club.",
    heroTag: "Meilleure vente",
    colors: ["Bleu Padelna", "Sable", "Blanc"],
    benefits: ["Sechage rapide", "Coutures plates", "Liberte d'epaule"],
    techFeatures: ["Mesh lateral", "Col stabilise", "Toucher doux"],
    reviews: [
      { name: "Yassine", rating: 5, comment: "Le tissu reste leger meme apres un long match. Super finition." },
      { name: "Rami", rating: 5, comment: "La coupe fait vraiment premium et tient bien au service." },
      { name: "Karim", rating: 4.4, comment: "Tres bon confort et seche vite. Je reprendrai une autre couleur." }
    ]
  },
  "alya-court-dress": {
    summary: "Une robe padel aerienne avec short integre et maintien fluide.",
    description:
      "Alya Court Dress a ete pensee pour les joueuses qui veulent de l'aisance dans les deplacements lateraux sans perdre l'elegance. Son tissu stretch accompagne le corps, son short integre securise le jeu et sa ligne moderne affirme l'identite Padelna.",
    heroTag: "Nouveau drop",
    colors: ["Blanc craie", "Bleu nuit", "Corail"],
    benefits: ["Short integre", "Tissu stretch", "Legerete premium"],
    techFeatures: ["Respirabilite micro-perforee", "Bretelles stables", "Anti-transpiration"],
    reviews: [
      {
        name: "Meriem",
        rating: 5,
        comment: "La robe tombe parfaitement et reste hyper confortable pendant le jeu."
      },
      { name: "Sana", rating: 4.8, comment: "Tres belle piece, feminine et vraiment adaptee au padel." }
    ]
  },
  "tunis-ace-shorts": {
    summary: "Un short nerveux et respirant pour accelerer a chaque echange.",
    description:
      "Tunis Ace Shorts mise sur une taille stable, une matiere extensible et des poches utiles pour les balles. Il accompagne l'entrainement, le match et les moments club avec une sensation de legerete continue.",
    heroTag: "Essentiel training",
    colors: ["Noir", "Bleu Padelna"],
    benefits: ["Mouvement libre", "Poches balles", "Poids plume"],
    techFeatures: ["Taille ajustee", "Stretch 4 directions", "Finition anti-frottement"],
    reviews: [
      { name: "Hamza", rating: 4.7, comment: "Bien coupe et tres agreable pendant les mouvements rapides." },
      { name: "Moez", rating: 4.5, comment: "Simple, efficace et vraiment bien respire." }
    ]
  },
  "medina-flex-skirt-set": {
    summary: "Une silhouette vive avec jupe technique et top seconde peau.",
    description:
      "Medina Flex Skirt Set est un ensemble pense pour le rythme du padel moderne. La jupe suit les accelerations, le top stabilise la silhouette et l'ensemble reste frais grace a une matiere selectionnee pour sa respirabilite.",
    heroTag: "Favori club",
    colors: ["Bleu glacier", "Blanc", "Terracotta"],
    benefits: ["Confort tournoi", "Look complet", "Maille douce"],
    techFeatures: ["Short integre discret", "Top respirant", "Finition premium"],
    reviews: [
      { name: "Ines", rating: 4.9, comment: "Le set est magnifique et tres confortable." },
      { name: "Lina", rating: 4.5, comment: "Belle coupe, tres bonne liberte de mouvement." }
    ]
  },
  "sahara-warm-up-jacket": {
    summary: "La veste d'echauffement premium pour entrer sur le court avec presence.",
    description:
      "Sahara Warm-Up Jacket apporte une couche sportive elegante, utile avant le match, pendant le voyage et apres la session. Sa structure legere bloque le vent, garde le confort et donne une allure forte a l'identite Padelna.",
    heroTag: "Outerwear",
    colors: ["Bleu profond", "Sable fumee"],
    benefits: ["Protection legere", "Style avant match", "Interieur doux"],
    techFeatures: ["Zip premium", "Poignets souples", "Coupe mixte"],
    reviews: [{ name: "Skander", rating: 4.8, comment: "Veste super classe, bonne tenue et tres beau bleu." }]
  },
  "jasmine-move-top": {
    summary: "Un top souple et respirant pour enchainer les echanges en confiance.",
    description:
      "Jasmine Move Top est une base essentielle pour les entrainements et les matchs d'ete. Son tissu technique evacue bien la chaleur et sa coupe feminine garde un tombant net sans compresser.",
    heroTag: "Couche essentielle",
    colors: ["Corail", "Blanc", "Bleu air"],
    benefits: ["Top leger", "Respiration active", "Seconde peau"],
    techFeatures: ["Fibre seche rapide", "Coutures fines", "Ligne feminine"],
    reviews: [{ name: "Aya", rating: 4.5, comment: "Top agreable et facile a porter sous une veste ou seul." }]
  },
  "lagoon-club-hoodie": {
    summary: "Le hoodie premium pour la sortie de court et la vie du club.",
    description:
      "Lagoon Club Hoodie prolonge l'energie Padelna apres le match. Sa matiere dense mais souple, sa capuche structuree et ses details propres donnent un rendu street-sport ideal pour la communaute padel.",
    heroTag: "Lifestyle",
    colors: ["Marine", "Ecru"],
    benefits: ["Confort club", "Capuche structuree", "Interieur brosse"],
    techFeatures: ["Maille premium", "Broderie Padelna", "Coupe unisexe"],
    reviews: [{ name: "Nour", rating: 4.7, comment: "Super qualitatif et parfait pour les fins de soiree au club." }]
  },
  "riviera-rally-tee": {
    summary: "Le tee de match epure pour jouer vite, leger et sans distraction.",
    description:
      "Riviera Rally Tee mise sur l'essentiel: une main douce, une excellente aeration et un fit moderne. C'est la piece facile a porter pour les joueurs qui veulent une base technique nette au quotidien.",
    heroTag: "Court quotidien",
    colors: ["Blanc", "Bleu Padelna", "Anthracite"],
    benefits: ["Toucher doux", "Aeration", "Look propre"],
    techFeatures: ["Maille fine", "Sechage rapide", "Col stable"],
    reviews: [{ name: "Wael", rating: 4.4, comment: "Tres bon tee pour jouer l'ete, simple et efficace." }]
  }
};

export const getLocalizedCategory = (value, language = "en") =>
  categoryLabels[value]?.[language] || value;

export const getLocalizedGender = (value, language = "en") =>
  genderLabels[value]?.[language] || value;

export const localizeProduct = (product, language = "en") => {
  if (!product || language === "en") {
    return product;
  }

  const localized = frenchProducts[product.slug] || {};

  return {
    ...product,
    category: getLocalizedCategory(product.category, language),
    gender: getLocalizedGender(product.gender, language),
    summary: localized.summary || product.summary,
    description: localized.description || product.description,
    heroTag: localized.heroTag || product.heroTag,
    colors: localized.colors || product.colors,
    benefits: localized.benefits || product.benefits,
    techFeatures: localized.techFeatures || product.techFeatures,
    reviews: localized.reviews || product.reviews
  };
};
