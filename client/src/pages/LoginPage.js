import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage({ role }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ role, ...form });
      navigate(role === 'admin' ? '/admin/dashboard' : '/worker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-md">
        <div className="glass-card p-8">
          <Link to="/" className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
            Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-black text-white">{role === 'admin' ? 'Admin Login' : 'Worker Login'}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {role === 'admin'
              ? 'Sign in to manage operations, workflow stages, approvals, notifications, and exports.'
              : 'Approved workers can sign in to create and track their own orders.'}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label">Email ID</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </div>

            {error && <div className="alert-error">{error}</div>}

            <button className={role === 'admin' ? 'btn-amber w-full' : 'btn-sky w-full'} disabled={loading}>
              {loading ? 'Signing in...' : role === 'admin' ? 'Open Admin Panel' : 'Open Worker Panel'}
            </button>
          </form>

          {role === 'worker' && (
            <div className="mt-6 flex justify-between text-sm text-slate-300">
              <Link className="hover:text-white" to="/worker/signup">
                New Signup
              </Link>
              <Link className="hover:text-white" to="/worker/forgot-password">
                Forgot Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
