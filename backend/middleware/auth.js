export function requireAuth(req, res, next) {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}
