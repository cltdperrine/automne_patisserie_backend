import getProduct from "./get-product.js";
import createProduct from "./post-product.js";
import patchProduct from "./patch-product.js";
import deleteProduct from "./delete-product.js";
import getProducts from "./get-products.js";
import getBestSellers from "./get-best-sellers.js";

const productsController = {
  create: createProduct,
  getAll: getProducts,
  get: getProduct,
  patch: patchProduct,
  delete: deleteProduct,
  getBestSellers: getBestSellers,
};

export default productsController;
