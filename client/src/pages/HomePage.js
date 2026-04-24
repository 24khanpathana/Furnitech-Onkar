import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const tiles = [
    {
      title: 'Admin Login',
      to: '/admin/login',
      className: 'btn-amber',
      description: 'Full oversight for orders, workflows, exports, deleted records, and approvals.',
    },
    {
      title: 'Worker Login',
      to: '/worker/login',
      className: 'btn-sky',
      description: 'Create orders and track only the work assigned to your account.',
    },
    {
      title: 'New Signup',
      to: '/worker/signup',
      className: 'btn-emerald',
      description: 'Register a new worker profile and send the approval request to admin.',
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-app text-slate-100">
      <div className="hero-grid mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 lg:flex-row lg:items-center lg:px-6">
        <section className="max-w-3xl">
          <div className="inline-flex rounded-full border border-amber-300/20 bg-amber-200/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-200">
            Industrial Order Intelligence
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl">
            Onkar
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A responsive admin and worker order management system for furniture operations, workflow tracking,
            approvals, analytics, exports, and customer-ready production visibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {tiles.map((tile) => (
              <Link key={tile.title} to={tile.to} className={tile.className}>
                {tile.title}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid flex-1 gap-4 lg:mt-0 lg:pl-12">
          {tiles.map((tile) => (
            <div key={tile.title} className="glass-card p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{tile.title}</p>
              <p className="mt-4 text-base leading-7 text-slate-300">{tile.description}</p>
            </div>
          ))}
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Core Modules</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <span className="pill">Dashboard analytics</span>
              <span className="pill">Worker approvals</span>
              <span className="pill">Order tracking</span>
              <span className="pill">CSV downloads</span>
              <span className="pill">Brevo email alerts</span>
              <span className="pill">Deleted order archive</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
