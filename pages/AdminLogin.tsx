import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAdmin } from '../services/authService';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInAdmin(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Login failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0b1124] to-[#07122f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-8">
        <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
        <p className="text-sm text-slate-300 mb-6">Sign in with your admin credentials to manage website content.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm text-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Password</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm text-white"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-300 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#4fb7b3] px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-900 hover:bg-[#3ea49a] transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
