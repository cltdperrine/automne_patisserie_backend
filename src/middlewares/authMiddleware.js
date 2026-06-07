import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const cookies = req.cookies;

  const token = cookies.token;

  if (!token) {
    return next();
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded) {
    req.user = decoded;
  } else {
    return req.status(403).json("Invalid token");
  }

  next();
}
