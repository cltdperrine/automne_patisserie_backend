import databaseClient from "../../../services/database.js";
import { productSchema } from "../product.validation.js";

export default async function createProduct(req, res) {
  const { name, price, description, allergens, categoryId } = req.body;

  const { error } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "Une image est obligatoire",
    });
  }

  try {
    const result = await databaseClient`
      INSERT INTO products (name, price, description, allergens, category_id) 
      VALUES (${name}, ${price}, ${description}, ${allergens}, ${categoryId}) 
      RETURNING *
    `;
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;

      await databaseClient`
    INSERT INTO images (
      url,
      product_id
    )
    VALUES (
      ${imageUrl},
      ${result[0].id}
    )
  `;
    }

    return res.status(201).json(result[0]);
  } catch (error) {
    console.error("Create product error:", error);
    return res
      .status(500)
      .json({ message: "Error during product creation", error: error.message });
  }
}
