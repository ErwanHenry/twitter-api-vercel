import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth.js";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { tweet_id } = req.body || {};
  if (!tweet_id) return res.status(400).json({ error: "tweet_id required" });
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
  
  const me = await client.v2.me();
  await client.v2.pinTweet(me.data.id, tweet_id);
  res.status(200).json({ ok: true });
};
