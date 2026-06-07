import databaseClient from "../../../services/database.js";
import { parsePositiveInt } from "../parse-positive-int.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function patchCartItem(req, res) {
  const userId = req.user.id;
  if (!userId) {
    return res.status(403).json("You need to log in to perform this action");
  }
  const productId = req.params.product_id;

  if (!isValidUUID(userId) || !isValidUUID(productId)) {
    return res.status(400).send("Invalid user or product id");
  }

  const { quantity } = req.body;

  const quantityParse = parsePositiveInt(quantity, "quantity");
  if (quantity === undefined || !quantityParse.ok) {
    return res.status(400).send("Valid quantity is required");
  }

  const qty = quantityParse.value;

  try {
    const result = await databaseClient`
      UPDATE cart
      SET quantity = ${qty}
      WHERE product_id = ${productId} AND user_id = ${userId}
      RETURNING *`;

    if (!result[0]) {
      return res.status(404).send("Cart line not found");
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error during cart update",
      error: error.message,
    });
  }
}
