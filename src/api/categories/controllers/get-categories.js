import databaseClient from "../../../services/database.js";

export default async function getCategories(req, res) {
  try {
    const categories = await databaseClient`
      SELECT * FROM categories`;

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error during categories retrieval",
      error: error.message,
    });
  }
}
