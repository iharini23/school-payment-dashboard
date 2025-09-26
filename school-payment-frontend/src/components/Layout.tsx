import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth';

const NAV_LINKS = [
  { path: '/', label: 'Dashboard' },
  { path: '/payments', label: 'New Payment' },
  { path: '/transactions', label: 'Transactions' },
];

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout, username } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold">School Payment Portal</span>

          {isAuthenticated ? (
            <nav className="flex items-center gap-6">
              <ul className="flex items-center gap-4 text-sm font-medium">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={clsx('transition-colors hover:text-sky-400', {
                        'text-sky-400': location.pathname === link.path,
                      })}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-300">{username}</span>
                <button
                  onClick={logout}
                  className="rounded bg-sky-500 px-3 py-1 font-semibold text-slate-950 transition-colors hover:bg-sky-400"
                >
                  Logout
                </button>
              </div>
            </nav>
          ) : (
            <nav>
              <Link className="text-sm text-sky-400" to="/login">
                Login
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
};
