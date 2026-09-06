import Router from "express";
import type { RequestHandler } from "express";
import * as productController from "../controllers/product_controller.js";
import isAuth from "../middleware/isAuth.js";
const router = Router();
// ============================ Product Controller ============================
router.get(
  "/viewProducts",
  isAuth as RequestHandler,
  productController.getProducts,
);
router.get(
  "/viewProductsByCategory/:id",
  productController.getProductsByCategory,
);
router.get(
  "/viewSingleProduct/:id",
  isAuth as RequestHandler,
  productController.getSingleProduct,
);

// ============================ Category Controller ============================
router.get(
  "/addCategory",
  isAuth as RequestHandler,
  productController.addCategorty,
);
router.get(
  "/viewCategories",
  isAuth as RequestHandler,
  productController.getCategory,
);

export default router;
