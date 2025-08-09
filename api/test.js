export default async function handler(req, res) {
  const hasAuth = req.headers.authorization === `Bearer ${process.env.API_SECRET_TOKEN}`;
  
  res.status(200).json({
    auth_valid: hasAuth,
    env_vars: {
      has_api_key: !!process.env.TWITTER_API_KEY,
      has_api_secret: !!process.env.TWITTER_API_SECRET,
      has_access_token: !!process.env.TWITTER_ACCESS_TOKEN,
      has_access_secret: !!process.env.TWITTER_ACCESS_SECRET,
      has_secret_token: !!process.env.API_SECRET_TOKEN
    },
    timestamp: new Date().toISOString()
  });
}
