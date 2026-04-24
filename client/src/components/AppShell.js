import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppShell({ title, description, navItems, children, accent = 'amber' }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.assign('/');
  };

  return (
    <div className="min-h-screen bg-app text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="glass-card hidden w-72 shrink-0 flex-col p-5 lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Onkar</p>
            <h1 className="mt-3 text-3xl font-black text-white">{title}</h1>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xl'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl bg-white/6 p-4">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{user?.role}</p>
            <p className="mt-3 text-sm text-slate-300">{user?.branch}</p>
            <button className={`btn-${accent} mt-4 w-full`} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="glass-card mb-6 p-5 lg:hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Onkar</p>
                <h1 className="mt-2 text-2xl font-black text-white">{title}</h1>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </div>
              <button className={`btn-${accent}`} onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-white text-slate-950'
                        : 'bg-white/8 text-slate-300 hover:bg-white/12 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
