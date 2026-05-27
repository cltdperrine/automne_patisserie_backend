import databaseClient from "../../../services/database.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function getProduct(req, res) {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).send("Invalid product id");
  }

  try {
    const result = await databaseClient`
  SELECT
    p.*,

    (
      SELECT i.url
      FROM images i
      WHERE i.product_id = p.id
      ORDER BY i.created_at ASC
      LIMIT 1
    ) AS image_url

  FROM products p

  WHERE p.id = ${id}
`;

    if (result.length === 0) {
      return res.status(404).send("Product not found");
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error during product retrieval",
      error: error.message,
    });
  }
}
