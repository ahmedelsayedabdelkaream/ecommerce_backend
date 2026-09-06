import type { Response, NextFunction } from "express";
import Product from "../model/product_model.js";
import Category from "../model/category_model.js";

// ============================ Category Controller ============================
export const addCategorty = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  // const {categoryName, categoryImage, categorySlug} = req.body
  const categoryName = "Vegetables";
  const categoryImage =
    "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const categorySlug = "vegetables";

  try {
    const category = new Category({
      name: categoryName,
      slug: categorySlug,
      imageUrl: categoryImage,
    });
    const result = await category.save();
    return res.status(200).json({ result });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
export const getCategory = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await Category.find();
    console.log(categories);
    return res.status(200).json({ categories });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

// ============================ Product Controller ============================
export const getProducts = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find()
      .sort({ price: 1 })
      .populate("category");
    console.log(products);
    return res.status(200).json({ products });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
export const getProductsByCategory = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.params.id);
    const products = await Product.find()
      .sort({ price: 1 })
      .populate("category")
      .where("category")
      .equals(req.params.id);
    console.log("===================================", products);
    return res.status(200).json({ products });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
export const getSingleProduct = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    console.log(product);
    return res.status(200).json({ product });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
