export const seedProducts = [
  {
    name: "Carthage Match Polo",
    slug: "carthage-match-polo",
    gender: "Men",
    price: 189,
    previousPrice: 219,
    category: "Matchwear",
    summary: "A light, sharp polo made for explosive points under Tunisian sun.",
    description:
      "Carthage Match Polo combines breathable fabric, flexible sleeves and a stable fit to keep the upper body free through every phase of play. It is a signature piece for players who want precision on court with a premium presence at the club.",
    heroTag: "Best seller",
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    stockCount: 16,
    rating: 4.8,
    reviewCount: 3,
    colors: ["Palina Blue", "Sand", "White"],
    sizes: ["S", "M", "L", "XL"],
    badges: ["Dry motion", "Premium fabric"],
    benefits: ["Quick dry", "Flat seams", "Shoulder freedom"],
    techFeatures: ["Side mesh", "Stabilized collar", "Soft handfeel"],
    images: [
      {
        url: "/product-catalog/palina-men-polo-set-1.png",
        alt: "Carthage Match Polo with Palina navy shorts and duffel"
      },
      {
        url: "/product-catalog/palina-men-polo-set-2.png",
        alt: "Carthage Match Polo travel look with cap and bag"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 26%", scale: 1.42, x: 57, y: 31 },
      { key: "shorts", position: "center 69%", scale: 1.45, x: 57, y: 63 },
      { key: "bag", position: "18% 84%", scale: 1.58, x: 24, y: 78 },
      { key: "cap", position: "center 8%", scale: 1.62, x: 54, y: 12 }
    ],
    reviews: [
      {
        name: "Yassine",
        rating: 5,
        comment: "The fabric stays light even after a long match. Great finish."
      },
      {
        name: "Rami",
        rating: 5,
        comment: "The fit feels premium and stays clean during the serve."
      },
      {
        name: "Karim",
        rating: 4.4,
        comment: "Very comfortable and dries fast. I would buy another color."
      }
    ]
  },
  {
    name: "Alya Court Dress",
    slug: "alya-court-dress",
    gender: "Women",
    price: 214,
    previousPrice: 244,
    category: "Matchwear",
    summary: "An airy padel dress with integrated shorts and fluid support.",
    description:
      "Alya Court Dress was built for players who want ease in lateral movement without losing elegance. The stretch fabric follows the body, the integrated shorts secure the game, and the modern line reinforces the Palina identity.",
    heroTag: "New drop",
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    stockCount: 10,
    rating: 4.9,
    reviewCount: 2,
    colors: ["Chalk White", "Night Blue", "Coral"],
    sizes: ["XS", "S", "M", "L"],
    badges: ["Feather fit", "Club chic"],
    benefits: ["Integrated shorts", "Stretch fabric", "Premium lightness"],
    techFeatures: ["Micro-perforated breathability", "Stable straps", "Sweat control"],
    images: [
      {
        url: "/product-catalog/palina-women-green-trim-dress.png",
        alt: "Alya Court Dress in white with green trim"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 25%", scale: 1.42, x: 52, y: 28 },
      { key: "skirt", position: "center 63%", scale: 1.46, x: 50, y: 60 },
      { key: "racket", position: "83% 75%", scale: 1.54, x: 76, y: 76 }
    ],
    reviews: [
      {
        name: "Meriem",
        rating: 5,
        comment: "The dress falls perfectly and stays very comfortable while playing."
      },
      {
        name: "Sana",
        rating: 4.8,
        comment: "Beautiful piece, feminine and really adapted to padel."
      }
    ]
  },
  {
    name: "Tunis Ace Shorts",
    slug: "tunis-ace-shorts",
    gender: "Men",
    price: 129,
    previousPrice: 149,
    category: "Training",
    summary: "A reactive, breathable short built to accelerate through every rally.",
    description:
      "Tunis Ace Shorts focus on a stable waistband, stretch fabric and useful ball pockets. They move easily from training to matches to club moments with a constant feeling of lightness.",
    heroTag: "Training essential",
    isNewArrival: false,
    isFeatured: true,
    inStock: true,
    stockCount: 24,
    rating: 4.6,
    reviewCount: 2,
    colors: ["Black", "Palina Blue"],
    sizes: ["S", "M", "L", "XL"],
    badges: ["Flexible waist", "Quick dry"],
    benefits: ["Free movement", "Ball pockets", "Featherweight feel"],
    techFeatures: ["Tuned waistband", "4-way stretch", "Anti-rub finish"],
    images: [
      {
        url: "/product-catalog/palina-men-sleeveless-navy.png",
        alt: "Tunis Ace Shorts with white sleeveless match top"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 24%", scale: 1.44, x: 50, y: 28 },
      { key: "shorts", position: "center 61%", scale: 1.48, x: 51, y: 62 },
      { key: "racket", position: "17% 78%", scale: 1.58, x: 19, y: 78 },
      { key: "socks", position: "center 92%", scale: 1.65, x: 52, y: 89 }
    ],
    reviews: [
      {
        name: "Hamza",
        rating: 4.7,
        comment: "Well cut and very pleasant during fast movements."
      },
      {
        name: "Moez",
        rating: 4.5,
        comment: "Simple, effective and very breathable."
      }
    ]
  },
  {
    name: "Medina Flex Skirt Set",
    slug: "medina-flex-skirt-set",
    gender: "Women",
    price: 198,
    previousPrice: 228,
    category: "Training",
    summary: "A lively silhouette with a technical skirt and second-skin top.",
    description:
      "Medina Flex Skirt Set is designed for the rhythm of modern padel. The skirt follows quick changes of direction, the top stabilizes the silhouette, and the full set stays fresh thanks to a fabric selected for breathability.",
    heroTag: "Club favorite",
    isNewArrival: true,
    isFeatured: false,
    inStock: true,
    stockCount: 14,
    rating: 4.7,
    reviewCount: 2,
    colors: ["Glacier Blue", "White", "Terracotta"],
    sizes: ["XS", "S", "M", "L"],
    badges: ["Coordinated set", "Light support"],
    benefits: ["Tournament comfort", "Full look", "Soft knit"],
    techFeatures: ["Hidden integrated shorts", "Breathable top", "Premium finishing"],
    images: [
      {
        url: "/product-catalog/palina-women-blue-trim.png",
        alt: "Medina Flex Skirt Set with pale blue trim"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 24%", scale: 1.42, x: 50, y: 28 },
      { key: "skirt", position: "center 62%", scale: 1.5, x: 50, y: 61 },
      { key: "racket", position: "16% 82%", scale: 1.56, x: 18, y: 80 }
    ],
    reviews: [
      {
        name: "Ines",
        rating: 4.9,
        comment: "The set looks amazing and feels very comfortable."
      },
      {
        name: "Lina",
        rating: 4.5,
        comment: "Beautiful fit with very good freedom of movement."
      }
    ]
  },
  {
    name: "Sahara Club Travel Set",
    slug: "sahara-warm-up-jacket",
    gender: "Men",
    price: 239,
    previousPrice: 269,
    category: "Accessories",
    summary: "A coordinated travel look with cap, duffel and clean pre-match polish.",
    description:
      "Sahara Club Travel Set captures the full Palina arrival moment with a structured polo, sharp shorts, matching cap and duffel presence. It is built for players who want a premium entrance from court travel to club lounge.",
    heroTag: "Travel look",
    isNewArrival: false,
    isFeatured: true,
    inStock: true,
    stockCount: 9,
    rating: 4.8,
    reviewCount: 1,
    colors: ["White", "Navy", "Palina Blue"],
    sizes: ["S", "M", "L", "XL"],
    badges: ["Cap + bag", "Club arrival"],
    benefits: ["Coordinated look", "Travel-ready", "Premium details"],
    techFeatures: ["Structured cap", "Signature duffel", "Clean athletic silhouette"],
    images: [
      {
        url: "/product-catalog/palina-men-polo-set-2.png",
        alt: "Sahara Club Travel Set with Palina cap and duffel"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 26%", scale: 1.42, x: 57, y: 31 },
      { key: "shorts", position: "center 69%", scale: 1.45, x: 57, y: 63 },
      { key: "bag", position: "18% 84%", scale: 1.58, x: 24, y: 78 },
      { key: "cap", position: "center 8%", scale: 1.62, x: 54, y: 12 }
    ],
    reviews: [
      {
        name: "Skander",
        rating: 4.8,
        comment: "Very classy travel look. The bag and cap finish it perfectly."
      }
    ]
  },
  {
    name: "Jasmine Move Top",
    slug: "jasmine-move-top",
    gender: "Women",
    price: 118,
    previousPrice: 138,
    category: "Training",
    summary: "A soft, breathable top for confident movement through every rally.",
    description:
      "Jasmine Move Top is an essential layer for training sessions and summer matches. Its technical fabric releases heat well while the feminine fit stays clean without compressing the body.",
    heroTag: "Core layer",
    isNewArrival: true,
    isFeatured: false,
    inStock: true,
    stockCount: 20,
    rating: 4.5,
    reviewCount: 1,
    colors: ["Coral", "White", "Sky Blue"],
    sizes: ["XS", "S", "M", "L"],
    badges: ["Soft touch", "Quick dry"],
    benefits: ["Light top", "Active airflow", "Second-skin feel"],
    techFeatures: ["Fast-dry fiber", "Fine seams", "Feminine line"],
    images: [
      {
        url: "/product-catalog/palina-women-navy-beach.png",
        alt: "Jasmine Move Top in navy beach court styling"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 26%", scale: 1.46, x: 50, y: 27 },
      { key: "skirt", position: "center 61%", scale: 1.5, x: 50, y: 59 },
      { key: "racket", position: "22% 82%", scale: 1.58, x: 22, y: 79 }
    ],
    reviews: [
      {
        name: "Aya",
        rating: 4.5,
        comment: "Comfortable top and very easy to wear on its own or under a jacket."
      }
    ]
  },
  {
    name: "Lagoon Victory Tee",
    slug: "lagoon-club-hoodie",
    gender: "Men",
    price: 209,
    previousPrice: 239,
    category: "Matchwear",
    summary: "A dark performance tee made for pressure points and post-rally emotion.",
    description:
      "Lagoon Victory Tee brings a sharper competitive tone to the Palina lineup. The lightweight technical knit keeps movement open while the contrast between the black top and white short creates a bold match-night silhouette.",
    heroTag: "Match energy",
    isNewArrival: false,
    isFeatured: false,
    inStock: true,
    stockCount: 12,
    rating: 4.7,
    reviewCount: 1,
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    badges: ["Match night", "Sharp contrast"],
    benefits: ["Competitive look", "Light stretch", "High airflow"],
    techFeatures: ["Laser-cut ventilation", "Soft technical knit", "Stable shoulder line"],
    images: [
      {
        url: "/product-catalog/palina-men-black-victory.png",
        alt: "Lagoon Victory Tee in black with white short"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 26%", scale: 1.44, x: 55, y: 28 },
      { key: "shorts", position: "center 67%", scale: 1.48, x: 55, y: 63 },
      { key: "racket", position: "88% 81%", scale: 1.56, x: 81, y: 79 }
    ],
    reviews: [
      {
        name: "Nour",
        rating: 4.7,
        comment: "Bold look on court and very easy to move in during hard points."
      }
    ]
  },
  {
    name: "Riviera Rally Tee",
    slug: "riviera-rally-tee",
    gender: "Men",
    price: 109,
    previousPrice: 129,
    category: "Matchwear",
    summary: "A clean match tee for fast play, light comfort and zero distraction.",
    description:
      "Riviera Rally Tee focuses on the essentials: soft touch, excellent airflow and a modern fit. It is the easy piece for players who want a clean technical base every day.",
    heroTag: "Everyday court",
    isNewArrival: true,
    isFeatured: false,
    inStock: true,
    stockCount: 18,
    rating: 4.4,
    reviewCount: 1,
    colors: ["White", "Palina Blue", "Anthracite"],
    sizes: ["S", "M", "L", "XL"],
    badges: ["Lightweight", "Court basic"],
    benefits: ["Soft touch", "Airflow", "Clean look"],
    techFeatures: ["Fine knit", "Quick dry", "Stable collar"],
    images: [
      {
        url: "/product-catalog/palina-men-white-match.png",
        alt: "Riviera Rally Tee in all-white action look"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 25%", scale: 1.44, x: 49, y: 27 },
      { key: "shorts", position: "center 63%", scale: 1.48, x: 52, y: 62 },
      { key: "racket", position: "70% 39%", scale: 1.52, x: 70, y: 39 }
    ],
    reviews: [
      {
        name: "Wael",
        rating: 4.4,
        comment: "Very good tee for summer play, simple and efficient."
      }
    ]
  },
  {
    name: "Noura Indoor Match Dress",
    slug: "noura-indoor-match-dress",
    gender: "Women",
    price: 224,
    previousPrice: 249,
    category: "Matchwear",
    summary: "A cool-toned dress shaped for indoor pace, control and fluid swings.",
    description:
      "Noura Indoor Match Dress pairs a supportive upper section with a fluid skirt line for balanced movement on enclosed courts. Its midnight and mist-blue palette gives Palina a technical, modern silhouette built for confident timing.",
    heroTag: "Indoor court",
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewCount: 2,
    colors: ["Midnight Blue", "Mist Blue"],
    sizes: ["XS", "S", "M", "L"],
    badges: ["Indoor control", "Technical dress"],
    benefits: ["Stable fit", "Fluid swing", "Quick comfort"],
    techFeatures: ["Performance stretch", "Breathable panels", "Integrated support"],
    images: [
      {
        url: "/product-catalog/palina-women-indoor-dress.png",
        alt: "Noura Indoor Match Dress on an enclosed padel court"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 23%", scale: 1.44, x: 50, y: 26 },
      { key: "skirt", position: "center 61%", scale: 1.48, x: 51, y: 59 },
      { key: "racket", position: "83% 37%", scale: 1.54, x: 77, y: 35 }
    ],
    reviews: [
      {
        name: "Rania",
        rating: 4.9,
        comment: "The dress feels technical and really clean when changing direction."
      },
      {
        name: "Loubna",
        rating: 4.7,
        comment: "Super flattering fit and a great color balance for padel."
      }
    ]
  },
  {
    name: "Ariana Pink Court Set",
    slug: "ariana-pink-court-set",
    gender: "Women",
    price: 186,
    previousPrice: 209,
    category: "Training",
    summary: "A bright white-and-blush set built for soft elegance and confident movement.",
    description:
      "Ariana Pink Court Set balances clean white essentials with a subtle blush skirt for a lighter, polished silhouette. It is designed for players who want a feminine court look with reliable comfort across practice and club play.",
    heroTag: "Soft court",
    isNewArrival: true,
    isFeatured: false,
    inStock: true,
    stockCount: 13,
    rating: 4.7,
    reviewCount: 1,
    colors: ["White", "Blush Pink"],
    sizes: ["XS", "S", "M", "L"],
    badges: ["Light silhouette", "Club ready"],
    benefits: ["Easy movement", "Fresh feel", "Elegant set"],
    techFeatures: ["Soft stretch", "Breathable jersey", "Pleated comfort"],
    images: [
      {
        url: "/product-catalog/palina-women-pink-skirt.png",
        alt: "Ariana Pink Court Set in white and blush pink"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 26%", scale: 1.44, x: 51, y: 28 },
      { key: "skirt", position: "center 61%", scale: 1.48, x: 50, y: 59 },
      { key: "racket", position: "22% 81%", scale: 1.56, x: 20, y: 79 }
    ],
    reviews: [
      {
        name: "Salma",
        rating: 4.7,
        comment: "Very clean look, very soft on body, and perfect for sunny sessions."
      }
    ]
  },
  {
    name: "Sunset Ace Pleated Set",
    slug: "sunset-ace-pleated-set",
    gender: "Women",
    price: 194,
    previousPrice: 219,
    category: "Training",
    summary: "A minimal white pleated set designed for sunset play and clean athletic ease.",
    description:
      "Sunset Ace Pleated Set combines a structured cropped top with a flowing pleated skirt for a refined after-hours court presence. It keeps the Palina line sharp while staying light enough for long summer sessions.",
    heroTag: "Sunset play",
    isNewArrival: true,
    isFeatured: false,
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 1,
    colors: ["Pure White", "Soft Sand"],
    sizes: ["XS", "S", "M", "L"],
    badges: ["Pleated flow", "Sunset ready"],
    benefits: ["Light support", "Elegant movement", "Clean finish"],
    techFeatures: ["Quick-dry knit", "Soft waistband", "Refined court line"],
    images: [
      {
        url: "/product-catalog/palina-women-sunset-white.png",
        alt: "Sunset Ace Pleated Set in all white on an outdoor court"
      }
    ],
    focusAreas: [
      { key: "top", position: "center 25%", scale: 1.46, x: 51, y: 27 },
      { key: "skirt", position: "center 60%", scale: 1.5, x: 50, y: 58 },
      { key: "racket", position: "16% 83%", scale: 1.58, x: 20, y: 79 }
    ],
    reviews: [
      {
        name: "Nesrine",
        rating: 4.9,
        comment: "One of the cleanest looks in the collection and beautiful at golden hour."
      }
    ]
  }
];

let runtimeProducts = structuredClone(seedProducts);

export const getRuntimeProducts = () => runtimeProducts;

export const getRuntimeProductBySlug = (slug) => runtimeProducts.find((product) => product.slug === slug);

export const updateRuntimeProduct = (slug, updater) => {
  runtimeProducts = runtimeProducts.map((product) =>
    product.slug === slug ? updater(product) : product
  );

  return getRuntimeProductBySlug(slug);
};
