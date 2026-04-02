export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { address, price, beds, baths, sqft, type, features, neighborhood, notes } = req.body;
  if (!address || !price || !beds || !baths || !features) return res.status(400).json({ error: 'Missing required fields.' });
 
  const system = `You are a real estate marketing copywriter for Paige Bieker at McPherson Sisters Homes in Minneapolis/Western Metro MN. Her brand is warm, authentic, aspirational, Instagram-native, luxury-focused.
 
Return ONLY a raw JSON object, no markdown, no backticks:
{"instagram_caption":"...","email_blast":"SUBJECT: [subject]\\n\\n[body]","listing_description":"..."}
 
instagram_caption: 150-250 words, emojis, line breaks, 10-15 hashtags, warm excited voice.
email_blast: subject line first prefixed SUBJECT:, then blank line, then 200-300 word email body, use [Paige's phone] and [Paige's email] as placeholders.
listing_description: 150-200 words, evocative, luxury, lifestyle-focused MLS description.`;
 
  const user = `Address: ${address}\nPrice: $${Number(price).toLocaleString()}\nBeds: ${beds} | Baths: ${baths}\nSqFt: ${sqft||'not specified'}\nType: ${type}\nFeatures: ${features}\nNeighborhood: ${neighborhood||'Twin Cities Western Metro MN'}\nNotes: ${notes||'none'}`;
 
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-6', max_tokens: 1500, system, messages: [{ role: 'user', content: user }] })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: 'AI error: ' + (data.error?.message || 'unknown') });
    const raw = data.content?.map(i => i.text || '').join('').replace(/```json|```/g, '').trim();
    return res.status(200).json(JSON.parse(raw));
  } catch (e) {
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}
 
