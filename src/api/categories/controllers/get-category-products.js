import databaseClient from "../../../services/database.js";

// TODO: move this logic in the products controller, we need to add a category filter to the get all products endpoint

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

export default async function getCategoryProducts(req, res) {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).send("Invalid category id");
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
      WHERE category_id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).send("Category products are not found");
    }
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error during category products retrieval",
      error: error.message,
    });
  }
}
