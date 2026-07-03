import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_default';

// In-memory storage (reset on each redeploy)
let messages = [];
let idCounter = 1;

function authenticate(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const { method, url, body } = req;

  // GET /api/admin/messages (protected)
  if (method === 'GET' && url === '/api/admin/messages') {
    const user = authenticate(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    return res.status(200).json(messages);
  }

  // POST /api/messages (public)
  if (method === 'POST' && url === '/api/messages') {
    const { nama, email, pesan } = body;
    if (!nama || !pesan) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    const newMsg = {
      id: idCounter++,
      nama,
      email: email || '-',
      pesan,
      tanggal: new Date().toLocaleString('en-US', { hour12: false }),
      sudahDibaca: false,
    };
    messages.push(newMsg);
    return res.status(201).json({ success: true, id: newMsg.id });
  }

  // PUT /api/admin/messages/:id (protected)
  if (method === 'PUT' && url.startsWith('/api/admin/messages/')) {
    const user = authenticate(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const id = parseInt(url.split('/').pop(), 10);
    const idx = messages.findIndex(m => m.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    messages[idx].sudahDibaca = true;
    return res.status(200).json({ success: true });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
