import databaseClient from "../../../services/database.js";

export default async function getProducts(req, res) {
  try {
    const { categoryId } = req.query;
    let products;
    if (categoryId) {
      products = await databaseClient`
      SELECT
        p.*,
        c.name AS category_name,
        (
          SELECT i.url
          FROM images i
          WHERE i.product_id = p.id
          ORDER BY i.created_at ASC
          LIMIT 1
        ) AS image_url
      FROM products p
      JOIN categories c
      ON c.id = p.category_id
      WHERE p.category_id = ${categoryId}
      ORDER BY p.created_at ASC`;
    } else {
      products = await databaseClient`
      SELECT
        p.*,
        c.name AS category_name,

        (
          SELECT i.url
          FROM images i
          WHERE i.product_id = p.id
          ORDER BY i.created_at ASC
          LIMIT 1
        ) AS image_url
      FROM products p
      JOIN categories c
      ON c.id = p.category_id
      ORDER BY p.created_at ASC`;
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error during products retrieval",
      error: error.message,
    });
  }
}
