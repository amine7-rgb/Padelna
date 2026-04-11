import { Product } from "../models/Product.js";
import { getRuntimeProductBySlug, getRuntimeProducts, updateRuntimeProduct } from "../data/products.js";
import { isMongoConnected } from "../config/db.js";

const recalculateProduct = (product) => {
  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const rating = reviewCount
    ? Number((reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount).toFixed(1))
    : 0;

  return { ...product, rating, reviewCount };
};

export const listProducts = async (_req, res) => {
  if (isMongoConnected()) {
    const products = await Product.find().sort({ isFeatured: -1, createdAt: -1 }).lean();
    return res.json({ ok: true, products });
  }

  return res.json({ ok: true, products: getRuntimeProducts() });
};

export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  if (isMongoConnected()) {
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }

    return res.json({ ok: true, product });
  }

  const product = getRuntimeProductBySlug(slug);

  if (!product) {
    return res.status(404).json({ error: "Produit introuvable." });
  }

  return res.json({ ok: true, product });
};

export const addProductReview = async (req, res) => {
  const { slug } = req.params;
  const { name, rating, comment } = req.body || {};

  if (!name || !comment || !rating) {
    return res.status(400).json({ error: "Nom, note et commentaire sont obligatoires." });
  }

  const normalizedRating = Number(rating);

  if (Number.isNaN(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    return res.status(400).json({ error: "La note doit etre comprise entre 1 et 5." });
  }

  if (isMongoConnected()) {
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }

    product.reviews.push({ name, rating: normalizedRating, comment });
    product.reviewCount = product.reviews.length;
    product.rating =
      product.reviewCount > 0
        ? Number(
            (
              product.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
              product.reviewCount
            ).toFixed(1)
          )
        : 0;

    await product.save();

    return res.status(201).json({ ok: true, product: product.toObject() });
  }

  const product = updateRuntimeProduct(slug, (current) =>
    recalculateProduct({
      ...current,
      reviews: [
        ...current.reviews,
        {
          name,
          rating: normalizedRating,
          comment,
          createdAt: new Date().toISOString()
        }
      ]
    })
  );

  if (!product) {
    return res.status(404).json({ error: "Produit introuvable." });
  }

  return res.status(201).json({ ok: true, product });
};

