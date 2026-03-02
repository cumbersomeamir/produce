export function validate(schema) {
  return function validator(req, res, next) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
      return;
    }
    req.body = parsed.data;
    next();
  };
}
