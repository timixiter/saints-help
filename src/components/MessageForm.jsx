import { useState } from 'react';
import { useMessages } from '../hooks/useMessages';

export default function MessageForm() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [pesan, setPesan] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const { sendMessage } = useMessages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) {
      setStatus({ type: 'error', message: 'Nama dan pesan wajib diisi!' });
      return;
    }

    const result = await sendMessage({ nama, email, pesan });
    if (result.success) {
      setStatus({ type: 'success', message: '✅ Permintaan berhasil dikirim!' });
      setNama('');
      setEmail('');
      setPesan('');
    } else {
      setStatus({ type: 'error', message: '❌ ' + result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nama Lengkap *</label>
        <input value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Isi Permintaan *</label>
        <textarea rows="5" value={pesan} onChange={(e) => setPesan(e.target.value)} required />
      </div>
      {status.message && (
        <div style={{ color: status.type === 'success' ? 'green' : 'red', marginBottom: '10px' }}>
          {status.message}
        </div>
      )}
      <button type="submit">Kirim</button>
    </form>
  );
}
