import databaseClient from "../../../services/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../auth.validation.js";

const SIGNATURE = process.env.JWT_SECRET;

export default async function signIn(req, res) {
  // Validate incoming request data
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { email, password } = req.body;

  // Retrieve user from database
  const [user] = await databaseClient`
  SELECT * FROM users WHERE email = ${email}`;

  // If user does not exist
  if (!user) {
    return res.status(401).json("Identifiant ou mot de passe incorrects");
  }

  // Compare provided password with hashed password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json("Identifiant ou mot de passe incorrects");
  }

  // JWT payload
  const payload = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };

  // Generate authentication token
  const token = jwt.sign(payload, SIGNATURE);

  // Store token in an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ user: payload, token });
}
