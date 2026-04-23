import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Brand } from '../components/Brand.jsx';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@anandindia.com');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('aibh_token', token);
      nav('/admin');
    } catch (e) {
      setErr(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6 gradient-header">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 text-white">
          <Link to="/" className="inline-block"><Brand light /></Link>
        </div>
        <form onSubmit={onSubmit} className="card space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/15 text-gold-500 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Admin Access</h1>
              <p className="text-xs opacity-60">Dashboard login</p>
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading && <Loader2 size={16} className="animate-spin" />} Sign in
          </button>
          <p className="text-xs opacity-60 text-center">
            Default: admin@anandindia.com / admin123 (set via <code>.env</code>).
          </p>
        </form>
      </div>
    </div>
  );
}
