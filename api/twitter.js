import { TwitterApi } from 'twitter-api-v2';

const getClient = () => {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  }).readWrite;
};

const isAuthorized = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  return token === process.env.API_SECRET_TOKEN;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { action, data } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Missing action' });
  }

  try {
    const client = getClient();
    let result;

    switch (action) {
      case 'post_tweet': {
        const { text, reply_to_tweet_id, media_ids } = data;
        const tweetData = { text };
        
        if (reply_to_tweet_id) {
          tweetData.reply = { in_reply_to_tweet_id: reply_to_tweet_id };
        }
        
        if (media_ids?.length > 0) {
          tweetData.media = { media_ids };
        }
        
        const tweet = await client.v2.tweet(tweetData);
        result = {
          success: true,
          data: tweet.data,
          message: `Tweet posted! ID: ${tweet.data.id}`,
          url: `https://twitter.com/i/status/${tweet.data.id}`
        };
        break;
      }

      case 'search_tweets': {
        const { query, count = 20 } = data;
        const tweets = await client.v2.search(query, {
          max_results: Math.min(count, 100),
          'tweet.fields': ['created_at', 'author_id', 'public_metrics']
        });
        
        result = {
          success: true,
          data: tweets.data?.data || [],
          count: tweets.data?.data?.length || 0
        };
        break;
      }

      case 'upload_media': {
        const { base64_data, media_type } = data;
        
        if (!base64_data || !media_type) {
          throw new Error('Missing base64_data or media_type');
        }
        
        const buffer = Buffer.from(base64_data, 'base64');
        const mediaId = await client.v1.uploadMedia(buffer, {
          mimeType: media_type
        });
        
        result = {
          success: true,
          media_id: mediaId,
          message: `Media uploaded! Use media_id: ${mediaId} in your tweet`
        };
        break;
      }

      case 'pin_tweet': {
        const { tweet_id } = data;
        
        if (!tweet_id) {
          throw new Error('Missing tweet_id');
        }
        
        const me = await client.v2.me();
        await client.v2.pinTweet(me.data.id, tweet_id);
        
        result = {
          success: true,
          message: `Tweet ${tweet_id} pinned successfully!`
        };
        break;
      }

      case 'delete_tweet': {
        const { tweet_id } = data;
        
        if (!tweet_id) {
          throw new Error('Missing tweet_id');
        }
        
        await client.v2.deleteTweet(tweet_id);
        
        result = {
          success: true,
          message: `Tweet ${tweet_id} deleted successfully!`
        };
        break;
      }

      case 'update_profile_banner': {
        const { base64_data } = data;
        
        if (!base64_data) {
          throw new Error('Missing base64_data');
        }
        
        const buffer = Buffer.from(base64_data, 'base64');
        
        if (buffer.length > 700 * 1024) {
          throw new Error('Banner image must be less than 700KB');
        }
        
        await client.v1.updateAccountProfileBanner(buffer);
        
        result = {
          success: true,
          message: 'Profile banner updated successfully!'
        };
        break;
      }

      case 'update_profile': {
        const updates = {};
        
        if (data.name !== undefined) updates.name = data.name;
        if (data.description !== undefined) updates.description = data.description;
        if (data.location !== undefined) updates.location = data.location;
        if (data.url !== undefined) updates.url = data.url;
        
        if (Object.keys(updates).length === 0) {
          throw new Error('No profile updates provided');
        }
        
        const profile = await client.v1.updateAccountProfile(updates);
        
        result = {
          success: true,
          message: 'Profile updated successfully!',
          updates: updates
        };
        break;
      }

      case 'get_me': {
        const me = await client.v2.me({
          'user.fields': ['profile_image_url', 'description', 'url']
        });
        
        result = {
          success: true,
          data: me.data
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error(`Error in ${action}:`, error);
    
    let errorMessage = error.message;
    if (error.errors) {
      errorMessage = error.errors.map(e => e.message).join(', ');
    }
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
      action: action
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
