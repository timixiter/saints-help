import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_default';

// Data sementara (hilang setiap redeploy)
let messages = [];
let idCounter = 1;

// Helper autentikasi
function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { method, body, query } = req;

  // ----- GET /api/admin/messages (butuh auth) -----
  if (method === 'GET' && req.url === '/api/admin/messages') {
    const user = authenticate(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }
    return res.status(200).json(messages);
  }

  // ----- POST /api/messages (publik) -----
  if (method === 'POST' && req.url === '/api/messages') {
    const { nama, email, pesan } = body;
    if (!nama || !pesan) {
      return res.status(400).json({ error: 'Nama dan pesan wajib diisi' });
    }
    const newMessage = {
      id: idCounter++,
      nama,
      email: email || '-',
      pesan,
      tanggal: new Date().toLocaleString('id-ID'),
      sudahDibaca: false,
    };
    messages.push(newMessage);
    return res.status(201).json({ success: true, id: newMessage.id });
  }

  // ----- PUT /api/admin/messages/:id (butuh auth) -----
  if (method === 'PUT' && req.url.startsWith('/api/admin/messages/')) {
    const user = authenticate(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }

    const id = parseInt(req.url.split('/').pop(), 10);
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Pesan tidak ditemukan' });
    }
    messages[index].sudahDibaca = true;
    return res.status(200).json({ success: true });
  }

  // Fallback
  return res.status(404).json({ error: 'Endpoint tidak ditemukan' });
}