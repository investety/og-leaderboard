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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Content-Type': 'application/json',
          'X-Discord-Locale': 'en-US',
          'X-Debug-Options': 'bugReporterEnabled',
          'Referer': 'https://discord.com/channels/1132794141403791483/1133796571343894137',
          'Origin': 'https://discord.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({ error: `Discord API error: ${response.status}`, detail: text });
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
      total
