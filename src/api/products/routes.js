import { Router } from "express";
import productsController from "./controllers/index.js";
import upload from "../../middlewares/upload.js";
import createProduct from "./controllers/post-product.js";

const productsRouter = Router();

productsRouter.post("/", upload.single("image"), productsController.create);
productsRouter.get("/", productsController.getAll);
productsRouter.get("/best-sellers", productsController.getBestSellers);
productsRouter.get("/:id", productsController.get);
productsRouter.patch("/:id", productsController.patch);
productsRouter.delete("/:id", productsController.delete);

export default productsRouter;
