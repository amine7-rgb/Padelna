const categoryLabels = {
  Matchwear: { en: "Matchwear", fr: "Matchwear" },
  Training: { en: "Training", fr: "Training" },
  Outerwear: { en: "Outerwear", fr: "Outerwear" },
  Accessories: { en: "Accessories", fr: "Accessoires" }
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
    colors: ["Bleu Palina", "Sable", "Blanc"],
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
      "Alya Court Dress a ete pensee pour les joueuses qui veulent de l'aisance dans les deplacements lateraux sans perdre l'elegance. Son tissu stretch accompagne le corps, son short integre securise le jeu et sa ligne moderne affirme l'identite Palina.",
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
    colors: ["Noir", "Bleu Palina"],
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
    summary: "Un look de voyage coordonne avec casquette, sac et allure premium avant match.",
    description:
      "Sahara Club Travel Set capture le moment d'arrivee Palina avec un polo structure, un short net, une casquette assortie et un sac duffel qui pose tout de suite la silhouette. Un ensemble pense pour le trajet, l'entree au club et une presence propre avant le premier point.",
    heroTag: "Travel look",
    colors: ["Blanc", "Marine", "Bleu Palina"],
    benefits: ["Look coordonne", "Pret pour le trajet", "Details premium"],
    techFeatures: ["Casquette structuree", "Sac signature", "Silhouette athletique nette"],
    reviews: [
      {
        name: "Skander",
        rating: 4.8,
        comment: "Super look de voyage, la casquette et le sac finissent parfaitement l'ensemble."
      }
    ]
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
    summary: "Un tee performance sombre pense pour les points sous pression et les celebrations.",
    description:
      "Lagoon Victory Tee apporte une tension plus competitive a la ligne Palina. Sa maille technique legere garde le mouvement libre tandis que le contraste du top noir et du short blanc cree une silhouette forte pour les matchs a haute intensite.",
    heroTag: "Match energy",
    colors: ["Noir", "Blanc"],
    benefits: ["Look competitif", "Stretch leger", "Grande aeration"],
    techFeatures: ["Ventilation decoupee", "Maille technique douce", "Ligne d'epaule stable"],
    reviews: [
      {
        name: "Nour",
        rating: 4.7,
        comment: "Look tres fort sur le court et excellente liberte de mouvement dans les points intenses."
      }
    ]
  },
  "riviera-rally-tee": {
    summary: "Le tee de match epure pour jouer vite, leger et sans distraction.",
    description:
      "Riviera Rally Tee mise sur l'essentiel: une main douce, une excellente aeration et un fit moderne. C'est la piece facile a porter pour les joueurs qui veulent une base technique nette au quotidien.",
    heroTag: "Court quotidien",
    colors: ["Blanc", "Bleu Palina", "Anthracite"],
    benefits: ["Toucher doux", "Aeration", "Look propre"],
    techFeatures: ["Maille fine", "Sechage rapide", "Col stable"],
    reviews: [{ name: "Wael", rating: 4.4, comment: "Tres bon tee pour jouer l'ete, simple et efficace." }]
  },
  "noura-indoor-match-dress": {
    summary: "Une robe froide et technique pour le rythme indoor, le controle et les swings fluides.",
    description:
      "Noura Indoor Match Dress associe un haut stable et une ligne de jupe fluide pour garder l'equilibre dans les courts fermes. Sa palette bleu nuit et bleu brume donne a Palina une silhouette moderne et tres nette pour le timing et la precision.",
    heroTag: "Indoor court",
    colors: ["Bleu nuit", "Bleu brume"],
    benefits: ["Fit stable", "Swing fluide", "Confort rapide"],
    techFeatures: ["Stretch performance", "Panneaux respirants", "Maintien integre"],
    reviews: [
      {
        name: "Rania",
        rating: 4.9,
        comment: "La robe est tres technique et reste propre meme dans les changements de direction."
      },
      {
        name: "Loubna",
        rating: 4.7,
        comment: "Super coupe et tres belle balance de couleurs pour le padel."
      }
    ]
  },
  "ariana-pink-court-set": {
    summary: "Un ensemble blanc et blush pour un style leger et un mouvement confiant.",
    description:
      "Ariana Pink Court Set melange une base blanche propre avec une jupe subtilement rose pour une silhouette plus douce et tres soignee. C'est une tenue faite pour les joueuses qui veulent un look feminin fiable pendant l'entrainement et la vie du club.",
    heroTag: "Soft court",
    colors: ["Blanc", "Rose blush"],
    benefits: ["Mouvement facile", "Sensation fraiche", "Set elegant"],
    techFeatures: ["Stretch doux", "Jersey respirant", "Confort plisse"],
    reviews: [
      {
        name: "Salma",
        rating: 4.7,
        comment: "Look tres propre, tres doux sur le corps, parfait pour les sessions au soleil."
      }
    ]
  },
  "sunset-ace-pleated-set": {
    summary: "Un set plisse minimaliste blanc pense pour les matchs au coucher du soleil.",
    description:
      "Sunset Ace Pleated Set associe un top crop structure et une jupe plissee fluide pour une presence tres nette sur le court en fin de journee. Il garde la ligne Palina elegante tout en restant leger pour les longues sessions d'ete.",
    heroTag: "Sunset play",
    colors: ["Blanc pur", "Sable doux"],
    benefits: ["Maintien leger", "Mouvement elegant", "Finition propre"],
    techFeatures: ["Maille seche rapide", "Taille douce", "Ligne raffinee"],
    reviews: [
      {
        name: "Nesrine",
        rating: 4.9,
        comment: "Un des looks les plus propres de la collection, magnifique a la golden hour."
      }
    ]
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
