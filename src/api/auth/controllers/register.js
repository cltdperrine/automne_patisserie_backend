import databaseClient from "../../../services/database.js";
import bcrypt from "bcrypt";
import { registerSchema } from "../auth.validation.js";

export default async function register(req, res) {
  const { first_name, last_name, email, password } = req.body;

  // Validate incoming data using Joi schema
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  try {
    // Check if a user with the same email already exists
    const [existingUser] = await databaseClient`
  SELECT id
  FROM users
  WHERE email = ${email}
  `;

    if (existingUser) {
      return res.status(409).json({
        message: "Cet email existe déjà",
      });
    }

    // Hash the password before storing it in the database
    const hashed = await bcrypt.hash(password, 10);

    // Create the new user
    const [user] = await databaseClient`        
        INSERT INTO users (first_name, last_name, email, password)
        VALUES (${first_name}, ${last_name}, ${email}, ${hashed})
        RETURNING id, first_name, last_name, email;`;

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ message: "Error during user creation", error: error.message });
  }
}
