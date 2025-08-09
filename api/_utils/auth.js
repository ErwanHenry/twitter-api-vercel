export function checkAuth(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_TOKEN}`) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }
  return true;
}
