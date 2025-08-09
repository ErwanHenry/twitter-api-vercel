import { TwitterApi } from "twitter-api-v2";
import { checkAuth } from "./_utils/auth";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const { name, description, location, url } = req.body || {};
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
  
  await client.v1.updateAccountProfile({ name, description, location, url });
  res.status(200).json({ ok: true });
};
