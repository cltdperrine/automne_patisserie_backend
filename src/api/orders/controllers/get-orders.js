import databaseClient from "../../../services/database.js";

export default async function getOrders(req, res) {
  try {
    const orders = await databaseClient`
      SELECT o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price
            )
          ) FILTER (WHERE oi.product_id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error during orders retrieval", error: error.message });
  }
}
