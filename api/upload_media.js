import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth.js";

export const config = { api: { bodyParser: { sizeLimit: "8mb" } } };

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  // Support both media_data (from MCP) and media_base64 (legacy)
  const { media_data, media_base64, media_type, mime } = req.body || {};
  const mediaData = media_data || media_base64;
  const mimeType = media_type || mime;
  
  if (!mediaData) {
    return res.status(400).json({ error: "media_data or media_base64 required" });
  }
  
  try {
    const buffer = Buffer.from(mediaData, "base64");
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    
    const media_id = await client.v1.uploadMedia(buffer, { 
      mimeType: mimeType || "image/jpeg" 
    });
    
    return res.status(200).json({ 
      ok: true, 
      media_id: media_id 
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to upload media" 
    });
  }
};
