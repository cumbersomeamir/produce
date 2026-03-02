export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
}
