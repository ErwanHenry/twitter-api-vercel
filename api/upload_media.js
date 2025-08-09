import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth";

export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { media_base64, mime } = req.body || {};
  if (!media_base64) return res.status(400).json({ error: "media_base64 required" });
  
  const buffer = Buffer.from(media_base64, "base64");
  const client = new TwitterApi({
    appKey: process.env.TW_API_KEY,
    appSecret: process.env.TW_API_SECRET,
    accessToken: process.env.TW_ACCESS_TOKEN,
    accessSecret: process.env.TW_ACCESS_SECRET,
  });
  
  const media_id = await client.v1.uploadMedia(buffer, { mimeType: mime });
  res.status(200).json({ ok: true, media_id });
};
