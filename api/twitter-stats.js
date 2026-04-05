export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'username required' });

  const RAPID_KEY = process.env.RAPIDAPI_KEY;
  if (!RAPID_KEY) return res.status(500).json({ error: 'RAPIDAPI_KEY not set' });

  try {
    const response = await fetch(
      `https://twittr-v2-fastest-twitter-x-api-150k-requests-for-15.p.rapidapi.com/user/by/username/${encodeURIComponent(username)}`,
      {
        headers: {
          'x-rapidapi-host': 'twittr-v2-fastest-twitter-x-api-150k-requests-for-15.p.rapidapi.com',
          'x-rapidapi-key': RAPID_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: `RapidAPI error: ${response.status}` });
    }

    const data = await response.json();
    const result = data?.data?.user?.result;
    if (!result) return res.status(404).json({ error: 'User not found' });

    const legacy = result.legacy || {};
    const avatar = result.avatar?.image_url || '';

    return res.status(200).json({
      username: legacy.screen_name || username,
      name: legacy.name || username,
      avatar,
      followers: legacy.followers_count || 0,
      following: legacy.friends_count || 0,
      posts: legacy.statuses_count || 0,
      likes: legacy.favourites_count || 0,
      verified: result.is_blue_verified || false,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
