import databaseClient from "../../../services/database.js";

function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

export default async function createOrder(req, res) {
  const {
    first_name,
    last_name,
    phone,
    pickup_location,
    pickup_date,
    notes,
    status,
    items,
  } = req.body;

  if (!first_name || !last_name || !phone || !pickup_location || !pickup_date) {
    return res.status(400).send("Missing required fields");
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).send("items must be a non-empty array");
  }

  for (const item of items) {
    if (!item || !isPositiveInt(item.quantity)) {
      return res.status(400).send("Invalid item");
    }
  }

  try {
    console.log("UUID validation OK");
    const productIds = [...new Set(items.map((i) => i.product_id))];
    const products = await databaseClient`
      SELECT id, price FROM products WHERE id = ANY(${productIds})
    `;

    const allProducts = await databaseClient`
  SELECT id, name FROM products
`;
    if (products.length !== productIds.length) {
      return res.status(400).send("one or more product_id values do not exist");
    }

    const priceById = new Map(products.map((p) => [p.id, p.price]));

    const [order] = await databaseClient`
  INSERT INTO orders (
    first_name,
    last_name,
    phone,
    pickup_location,
    pickup_date,
    notes,
    status
  )
  VALUES (
    ${first_name},
    ${last_name},
    ${phone},
    ${pickup_location},
    ${pickup_date},
    ${notes},
    ${status}
  )
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
