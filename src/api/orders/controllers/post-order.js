import databaseClient from "../../../services/database.js";

function isValidUUID(value) {
  return typeof value === "string" && value.length === 36;
}

function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

export default async function createOrder(req, res) {
  const { client_id, status, items } = req.body;

  if (!client_id || !status) {
    return res.status(400).send("client_id and status are required");
  }

  if (!isValidUUID(client_id)) {
    return res.status(400).send("Invalid client id");
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).send("items must be a non-empty array");
  }

  for (const item of items) {
    if (
      !item ||
      !isValidUUID(item.product_id) ||
      !isPositiveInt(item.quantity)
    ) {
      return res
        .status(400)
        .send(
          "each item requires a valid product_id and a positive integer quantity",
        );
    }
  }

  try {
    const productIds = [...new Set(items.map((i) => i.product_id))];
    const products = await databaseClient`
      SELECT id, price FROM products WHERE id = ANY(${productIds})
    `;

    if (products.length !== productIds.length) {
      return res.status(400).send("one or more product_id values do not exist");
    }

    const priceById = new Map(products.map((p) => [p.id, p.price]));

    const [order] = await databaseClient`
      INSERT INTO orders (client_id, status)
      VALUES (${client_id}, ${status})
      RETURNING *
    `;

    const itemInserts = items.map(
      (item) => databaseClient`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (${order.id}, ${item.product_id}, ${item.quantity}, ${priceById.get(item.product_id)})
        ON CONFLICT (order_id, product_id)
        DO UPDATE SET quantity = order_items.quantity + EXCLUDED.quantity
        RETURNING *
      `,
    );
    const insertedItems = await databaseClient.transaction(itemInserts);

    return res.status(201).json({ ...order, items: insertedItems.flat() });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      message: "Error during order creation",
      error: error.message,
    });
  }
}
