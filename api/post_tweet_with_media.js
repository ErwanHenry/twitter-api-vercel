import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { text, media_ids = [] } = req.body || {};
  if (!text) return res.status(400).json({ error: "text required" });
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
  
  const t = await client.v2.tweet({ 
    text, 
    media: media_ids.length ? { media_ids } : undefined 
  });
  res.status(200).json({ ok: true, tweet_id: t.data.id });
};
