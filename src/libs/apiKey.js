const API_KEY = "f5a6b6f6-1b6b-4b6a-8b6a-6b6a6b6b6b6a";

export default function apiKeyMiddleware(req, res, next) {
  const { apiKey } = req.body;

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}
