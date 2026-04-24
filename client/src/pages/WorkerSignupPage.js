import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signupWorker } from '../services/api';

function WorkerSignupPage() {
  const [form, setForm] = useState({
    name: '',
    branch: '',
    mobileNumber: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const { data } = await signupWorker(form);
      setMessage(data.message);
      setForm({ name: '', branch: '', mobileNumber: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit signup request.');
    }
  };

  return (
    <div className="min-h-screen bg-app px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-2xl">
        <div className="glass-card p-8">
          <Link to="/" className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">
            Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-black text-white">Worker Signup</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Submit your details for admin review. Only approved workers can login and access order tools.
          </p>

          <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Branch</label>
              <input className="input" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} required />
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <input className="input" value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email ID</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Password</label>
              <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            {message && <div className="alert-success md:col-span-2">{message}</div>}
            {error && <div className="alert-error md:col-span-2">{error}</div>}

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button className="btn-emerald" type="submit">
                Send Approval Request
              </button>
              <Link className="btn-ghost" to="/worker/login">
                Already have access
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WorkerSignupPage;
