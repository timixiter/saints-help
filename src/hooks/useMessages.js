import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat pesan');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (data) => {
    try {
      const res = await api.post('/messages', data);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Gagal mengirim' };
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/messages/${id}`);
      await loadMessages(); // refresh
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Gagal update status' };
    }
  };

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return { messages, loading, error, sendMessage, markAsRead, loadMessages };
}