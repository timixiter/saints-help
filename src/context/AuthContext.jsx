import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verifikasi token dengan memanggil endpoint yang butuh auth
      api
        .get('/admin/messages')
        .then(() => setIsAdmin(true))
        .catch(() => {
          localStorage.removeItem('adminToken');
          setIsAdmin(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (password) => {
    try {
      const res = await api.post('/admin/login', { password });
      const { token } = res.data;
      localStorage.setItem('adminToken', token);
      setIsAdmin(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login gagal' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
