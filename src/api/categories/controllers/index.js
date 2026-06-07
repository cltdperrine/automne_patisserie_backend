import deleteCategory from "./delete-category.js";
import getCategories from "./get-categories.js";
import getCategory from "./get-category.js";
import patchCategory from "./patch-category.js";
import createCategory from "./post-category.js";
import getCategoryProducts from "./get-category-products.js";

const categoriesController = {
  create: createCategory,
  getAll: getCategories,
  get: getCategory,
  patch: patchCategory,
  delete: deleteCategory,
  getCategoryProducts: getCategoryProducts,
};

export default categoriesController;
