import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import MessageList from '../components/MessageList';

export default function AdminPage() {
  const { logout } = useAuth();
  const { messages, loading, markAsRead } = useMessages();

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📩 Dashboard Admin</h1>
        <button onClick={logout} style={{ background: '#dc3545' }}>
          Logout
        </button>
      </div>

      {loading ? (
        <p>Memuat pesan...</p>
      ) : (
        <MessageList messages={messages} onMarkAsRead={markAsRead} />
      )}
    </div>
  );
}