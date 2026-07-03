import { Link } from 'react-router';
import MessageForm from '../components/MessageForm';

export default function PublicPage() {
  return (
    <div className="container">
      <h1>📨 Ajukan Permintaan</h1>
      <MessageForm />
      <hr />
      <p>
        <Link to="/login">🔐 Login Admin</Link>
      </p>
    </div>
  );
}