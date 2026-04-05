export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { page = 0 } = req.query;
  const GUILD_ID = '1132794141403791483';
  const url = `https://mee6.xyz/api/plugins/levels/leaderboard/${GUILD_ID}?limit=100&page=${page}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; leaderboard-bot/1.0)',
      },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'MEE6 API error' });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
