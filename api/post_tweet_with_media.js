import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth.js";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { text, media_ids = [] } = req.body || {};
  if (!text) return res.status(400).json({ error: "text required" });
  if (!Array.isArray(media_ids) || media_ids.length === 0) {
    return res.status(400).json({ error: "media_ids array required" });
  }
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
  
  try {
    const tweet = await client.v2.tweet({ 
      text, 
      media: { media_ids: media_ids }
    });
    
    return res.status(200).json({ 
      ok: true, 
      tweet_id: tweet.data.id 
    });
  } catch (error) {
    console.error("Tweet with media error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to post tweet with media" 
    });
  }
};
