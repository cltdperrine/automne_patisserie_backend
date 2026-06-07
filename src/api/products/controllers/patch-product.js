import databaseClient from "../../../services/database.js";
import { productSchema } from "../product.validation.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function patchProduct(req, res) {
  const id = req.params.id;
  const { name, price, description, allergens, categoryId } = req.body;

  const { error } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  if (!isValidUUID(id)) {
    return res.status(400).send("Invalid product id");
  }

  if (
    name === undefined &&
    price === undefined &&
    description === undefined &&
    allergens === undefined
  ) {
    return res.status(400).send("No data to update");
  }

  try {
    const result = await databaseClient`
        UPDATE products
        SET name = ${name}, price = ${price}, description = ${description}, allergens = ${allergens}, categoryId = ${categoryId}
        WHERE id = ${id}
        RETURNING *`;

    if (!result[0]) {
      return res.status(404).send("Product not found");
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error during product update", error: error.message });
  }
}
