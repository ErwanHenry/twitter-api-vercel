import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth";

export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { banner_base64 } = req.body || {};
  if (!banner_base64) return res.status(400).json({ error: "banner_base64 required" });
  
  const buffer = Buffer.from(banner_base64, "base64");
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
  
  await client.v1.updateAccountProfileBanner(buffer);
  res.status(200).json({ ok: true });
};
