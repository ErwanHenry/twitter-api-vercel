import { checkAuth } from "./_utils/auth.js";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!checkAuth(req, res)) return;
  
  const envVars = {
    hasApiSecretToken: !!process.env.API_SECRET_TOKEN,
    hasTwitterApiKey: !!process.env.TWITTER_API_KEY,
    hasTwitterApiSecret: !!process.env.TWITTER_API_SECRET,
    hasTwitterAccessToken: !!process.env.TWITTER_ACCESS_TOKEN,
    hasTwitterAccessSecret: !!process.env.TWITTER_ACCESS_SECRET,
    // Legacy check
    hasKctApiBearer: !!process.env.KCT_API_BEARER,
    hasTwApiKey: !!process.env.TW_API_KEY,
  };
  
  return res.status(200).json({
    ok: true,
    envVars,
    timestamp: Date.now()
  });
};
