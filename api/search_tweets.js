import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { query, max_results = 10 } = req.body || {};
  if (!query) return res.status(400).json({ error: "query required" });
  
  const client = new TwitterApi({
    appKey: process.env.TW_API_KEY,
    appSecret: process.env.TW_API_SECRET,
    accessToken: process.env.TW_ACCESS_TOKEN,
    accessSecret: process.env.TW_ACCESS_SECRET,
  });
  
  try {
    const tweets = await client.v2.search(query, {
      max_results: Math.min(Math.max(10, max_results), 100),
      "tweet.fields": ["author_id", "created_at", "public_metrics"],
      "user.fields": ["name", "username", "profile_image_url"],
      expansions: ["author_id"]
    });
    
    return res.status(200).json({
      ok: true,
      data: tweets.data || [],
      includes: tweets.includes || {},
      meta: tweets.meta
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to search tweets" 
    });
  }
};
