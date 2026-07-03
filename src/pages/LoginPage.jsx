import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Password salah');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <h1>🔑 Login Admin</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password admin"
            required
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '15px' }}>
        <Link to="/">← Kembali ke Public</Link>
      </p>
    </div>
  );
}
