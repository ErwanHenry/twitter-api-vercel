import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { text, reply_to_tweet_id } = req.body || {};
  if (!text) return res.status(400).json({ error: "text required" });
  
  const client = new TwitterApi({
    appKey: process.env.TW_API_KEY,
    appSecret: process.env.TW_API_SECRET,
    accessToken: process.env.TW_ACCESS_TOKEN,
    accessSecret: process.env.TW_ACCESS_SECRET,
  });
  
  const payload = reply_to_tweet_id 
    ? { text, reply: { in_reply_to_tweet_id: reply_to_tweet_id } } 
    : { text };
  
  const t = await client.v2.tweet(payload);
  res.status(200).json({ ok: true, tweet_id: t.data.id });
};
