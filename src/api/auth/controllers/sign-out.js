export default function signOut(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
    sameSite:
      process.env.NODE_ENV === "production" || !!process.env.VERCEL
        ? "none"
        : "lax",
  });

  return res.status(200).json({ message: "Déconnexion réussie" });
}
