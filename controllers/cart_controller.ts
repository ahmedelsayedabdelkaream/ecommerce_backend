import type { Response, NextFunction } from "express";
import User from "../model/user_model.js";
// ============================ Cart Controller ============================\\

export const getCart = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).populate(
      "cart.items.productId",
    );
    const cart = user?.cart?.items;
    return res.status(200).json({ cart });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
export const addToCart = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { productId, quantity } = req.body;
  console.log(req.userId, productId, quantity);
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.userId,
        "cart.items.productId": productId,
      },
      {
        $inc: { "cart.items.$.quantity": quantity },
      },
      {
        returnDocument: "after",
      },
    );
    if (!user) {
      await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { "cart.items": { productId, quantity } },
        },
        { returnDocument: "after" },
      );
    }
    return res.status(200).json({ message: "Product added to cart" });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const incrementCartItem = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.userId, "cart.items.productId": productId },
      { $inc: { "cart.items.$.quantity": 1 } },
      { returnDocument: "after" },
    ).populate("cart.items.productId");

    const cart = user?.cart?.items;
    return res
      .status(200)
      .json({ message: "Product added to cart", cart: cart });
  } catch (e: any) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
