import databaseClient from "../../../services/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SIGNATURE = process.env.JWT_SECRET;

export default async function signIn(req, res) {
  const { email, password } = req.body;

  const [user] = await databaseClient`
  SELECT * FROM users WHERE email = ${email}`;

  if (!user) {
    return res.status(401).json("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (isValid === false) {
    return res.status(401).json("Invalid password");
  }

  const payload = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, SIGNATURE);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ user: payload, token });
}
