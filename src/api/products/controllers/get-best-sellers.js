import databaseClient from "../../../services/database.js";

// eslint-disable-line no-unused-vars
export default async function getBestSellers(req, res) {
  const { limit = 4 } = req.query;
  try {
    const bestSellers = await databaseClient`
      SELECT p.*,
        COALESCE(SUM(oi.quantity), 0)::int AS total_sold,
        (
          SELECT i.url
          FROM images i
          WHERE i.product_id = p.id
          ORDER BY i.created_at ASC
          LIMIT 1
        ) AS image_url
      FROM products p
      JOIN order_items oi ON oi.product_id = p.id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status = 'fulfilled'
      GROUP BY p.id
      ORDER BY total_sold DESC, p.created_at ASC
      LIMIT ${limit}
    `;
    return res.status(200).json(bestSellers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error during best sellers retrieval",
      error: error.message,
    });
  }
}
