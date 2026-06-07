import databaseClient from "../../../services/database.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function clearCart(req, res) {
  const userId = req.user.id;
  if (!userId) {
    return res.status(403).json("You need to log in to perform this action");
  }

  if (!isValidUUID(userId)) {
    return res.status(400).send("Invalid user id");
  }

  try {
    await databaseClient`
      DELETE FROM cart WHERE user_id = ${userId}`;

    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
