import databaseClient from "../../../services/database.js";
import { parsePositiveInt } from "../parse-positive-int.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function addToCart(req, res) {
  const userId = req.user.id;
  if (!userId) {
    return res.status(403).json("You need to log in to perform this action");
  }
  const { product_id, quantity } = req.body;

  if (!isValidUUID(userId)) {
    return res.status(400).send("Invalid user id");
  }

  if (!isValidUUID(product_id)) {
    return res.status(400).send("Invalid product id");
  }

  const quantityParse = parsePositiveInt(quantity, "quantity");
  if (!quantityParse.ok) {
    return res.status(400).send(quantityParse.error);
  }

  const qty = quantityParse.value;

  try {
    const product = await databaseClient`
      SELECT id FROM products WHERE id = ${product_id}`;
    if (product.length === 0) {
      return res.status(404).send("Product not found");
    }

    const result = await databaseClient`
      INSERT INTO cart (product_id, user_id, quantity)
      VALUES (${product_id}, ${userId}, ${qty})
      ON CONFLICT (product_id, user_id)
      DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
      RETURNING *`;

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error during cart item add");
  }
}
