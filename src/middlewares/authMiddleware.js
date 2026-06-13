import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const cookies = req.cookies;

  const token = cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json("Invalid token");
  }
}
