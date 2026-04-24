import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';

function ForgotPasswordPage() {
  const [requestForm, setRequestForm] = useState({ email: '' });
  const [resetForm, setResetForm] = useState({ email: '', code: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');

  const handleRequestCode = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setDevCode('');

    try {
      const { data } = await forgotPassword(requestForm);
      setMessage(data.message);
      setDevCode(data.devResetCode || '');
      setResetForm((prev) => ({ ...prev, email: requestForm.email }));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate a reset code.');
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const { data } = await resetPassword(resetForm);
      setMessage(data.message);
      setResetForm({ email: '', code: '', newPassword: '' });
      setRequestForm({ email: '' });
      setDevCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-app px-4 py-12 text-slate-100">
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-black text-white">Forgot Password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Request a reset code for an approved worker account, then set a new password.
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleRequestCode}>
            <div>
              <label className="label">Worker Email ID</label>
              <input
                className="input"
                type="email"
                value={requestForm.email}
                onChange={(event) => setRequestForm({ email: event.target.value })}
                required
              />
            </div>
            <button className="btn-sky w-full" type="submit">
              Generate Reset Code
            </button>
          </form>
          {devCode && <div className="alert-success mt-5">Development reset code: {devCode}</div>}
        </div>

        <div className="glass-card p-8">
          <h2 className="text-3xl font-black text-white">Reset Password</h2>
          <form className="mt-8 space-y-5" onSubmit={handleResetPassword}>
            <div>
              <label className="label">Email ID</label>
              <input
                className="input"
                type="email"
                value={resetForm.email}
                onChange={(event) => setResetForm({ ...resetForm, email: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Reset Code</label>
              <input
                className="input"
                value={resetForm.code}
                onChange={(event) => setResetForm({ ...resetForm, code: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                className="input"
                type="password"
                value={resetForm.newPassword}
                onChange={(event) => setResetForm({ ...resetForm, newPassword: event.target.value })}
                required
              />
            </div>
            <button className="btn-emerald w-full" type="submit">
              Save New Password
            </button>
          </form>

          {message && <div className="alert-success mt-5">{message}</div>}
          {error && <div className="alert-error mt-5">{error}</div>}

          <div className="mt-6">
            <Link className="text-sm text-slate-300 hover:text-white" to="/worker/login">
              Back to Worker Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
