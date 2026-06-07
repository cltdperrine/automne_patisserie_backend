import { Router } from "express";
import cartController from "./controllers/index.js";

const cartRouter = Router();

cartRouter.post("/users/cart", cartController.addToCart);
cartRouter.get("/users/cart", cartController.getCart);
cartRouter.patch("/users/cart/:product_id", cartController.patchCartItem);
cartRouter.delete("/users/cart", cartController.clearCart);
cartRouter.delete("/users/cart/:product_id", cartController.removeFromCart);

export default cartRouter;
