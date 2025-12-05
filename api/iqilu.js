export default async function handler(req, res) {
  const API_TOKEN = process.env.API_TOKEN;

  if (API_TOKEN) {
    const ua = req.headers['user-agent'] || '';
    if (!ua.includes(API_TOKEN)) {
      return res.status(403).send('Forbidden');
    }
  }

  const orgid = req.query.orgid;
  const num = parseInt(req.query.num, 10);

  if (!orgid) {
    return res.status(400).send("Missing orgid parameter");
  }
  if (isNaN(num)) {
    return res.status(400).send("Invalid num parameter");
  }

  try {
    const response = await fetch(`https://app.litenews.cn/v1/app/play/tv/live?orgid=${orgid}`);
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return res.status(404).send("No streams found for this orgid");
    }

    if (num < 0 || num >= data.data.length) {
      return res.status(400).send(`num out of range, valid range: 0-${data.data.length - 1}`);
    }

    const stream = data.data[num].stream;

    res.writeHead(302, { Location: stream });
    res.end();
  } catch (err) {
    res.status(500).send(err.message);
  }
}