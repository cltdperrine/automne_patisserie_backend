import { Router } from "express";
import categoriesController from "./controllers/index.js";

const categoriesRouter = Router();

categoriesRouter.post("/", categoriesController.create);
categoriesRouter.get("/", categoriesController.getAll);
categoriesRouter.get("/:id/products", categoriesController.getCategoryProducts);
categoriesRouter.get("/:id", categoriesController.get);
categoriesRouter.patch("/:id", categoriesController.patch);
categoriesRouter.delete("/:id", categoriesController.delete);

export default categoriesRouter;
