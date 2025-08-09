export function checkAuth(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.KCT_API_BEARER}`) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }
  return true;
}
