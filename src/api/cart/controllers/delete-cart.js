import databaseClient from "../../../services/database.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function deleteCart(req, res) {
  const { product_id } = req.params;

  const userId = req.user.id;
  if (!userId) {
    return res.status(403).json("You need to log in to perform this action");
  }

  if (!isValidUUID(user_id) || !isValidUUID(product_id)) {
    return res.status(400).send("Invalid user or product id");
  }

  try {
    const result = await databaseClient`
    DELETE FROM cart WHERE product_id = ${product_id} AND user_id = ${user_id} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).send("Cart item not found");
    }
    return res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error during cart deletion", error: error.message });
  }
}
