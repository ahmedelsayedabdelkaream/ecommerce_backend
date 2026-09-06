import { Router, type RequestHandler } from "express";
import * as cartController from "../controllers/cart_controller.js";
import isAuth from "../middleware/isAuth.js";
const router = Router();

router.get("/getCart", isAuth as RequestHandler, cartController.getCart);
router.post("/addToCart", isAuth as RequestHandler, cartController.addToCart);
router.post(
  "/incrementCartItem",
  isAuth as RequestHandler,
  cartController.incrementCartItem,
);

export default router;
