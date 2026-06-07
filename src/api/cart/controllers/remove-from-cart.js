import databaseClient from "../../../services/database.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function removeFromCart(req, res) {
  const userId = req.user.id;
  if (!userId) {
    return res.status(403).json("You need to log in to perform this action");
  }
  const productId = req.params.product_id;

  if (!isValidUUID(userId)) {
    return res.status(400).send("Invalid user id");
  }
  if (!isValidUUID(productId)) {
    return res.status(400).send("Invalid product id");
  }

  try {
    const result = await databaseClient`
      DELETE FROM cart
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING *`;

    if (result.length === 0) {
      return res.status(404).send("Item not found in cart");
    }

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
