export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const CHANNEL_ID = '1133796571343894137';
  const TOKEN = process.env.DISCORD_TOKEN;

  if (!TOKEN) {
    return res.status(500).json({ error: 'DISCORD_TOKEN not set' });
  }

  const handles = new Set();
  let lastId = null;
  let iterations = 0;
  const MAX_ITERATIONS = 50;

  try {
    while (iterations < MAX_ITERATIONS) {
      let url = `https://discord.com/api/v9/channels/${CHANNEL_ID}/messages?limit=100`;
      if (lastId) url += `&before=${lastId}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': TOKEN,
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: `Discord API error: ${response.status}` });
      }

      const messages = await response.json();
      if (!messages.length) break;

      for (const msg of messages) {
        const content = msg.content || '';
        const matches = content.matchAll(/(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]{1,50})(?:\/|\s|$)/g);
        for (const match of matches) {
          const handle = match[1].toLowerCase();
          if (!['home','search','explore','notifications','messages','i','intent','share','hashtag','status'].includes(handle)) {
            handles.add(handle);
          }
        }
        lastId = msg.id;
      }

      if (messages.length < 100) break;
      iterations++;
      await new Promise(r => setTimeout(r, 300));
    }

    return res.status(200).json({
      handles: [...handles],
      total: handles.size,
      messages_scanned: iterations * 100,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
