import { Router } from "express";
import productsController from "./controllers/index.js";
import upload from "../../middlewares/upload.js";
import createProduct from "./controllers/post-product.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const productsRouter = Router();

productsRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  productsController.create,
);
productsRouter.get("/", productsController.getAll);
productsRouter.get("/best-sellers", productsController.getBestSellers);
productsRouter.get("/:id", productsController.get);
productsRouter.patch("/:id", authMiddleware, roleMiddleware("admin"), productsController.patch);
productsRouter.delete("/:id", authMiddleware, roleMiddleware("admin"), productsController.delete);

export default productsRouter;
