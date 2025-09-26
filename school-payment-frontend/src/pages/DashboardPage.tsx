import { Link } from 'react-router-dom';
import { TransactionsTable } from '../components/TransactionsTable';

export const DashboardPage = () => (
  <div className="space-y-10">
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-2 text-sm text-slate-400">
        Track new and recent payment activity for your school. Use the navigation above to create
        payments or review detailed transaction history.
      </p>
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link
          to="/payments"
          className="rounded bg-sky-500 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-sky-400"
        >
          Create payment
        </Link>
        <Link
          to="/transactions"
          className="rounded border border-sky-500 px-4 py-2 font-semibold text-sky-400 transition-colors hover:bg-sky-500/20"
        >
          View transactions
        </Link>
      </div>
    </section>

    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent transactions</h2>
        <Link className="text-sm text-sky-400" to="/transactions">
          View all
        </Link>
      </header>
      <TransactionsTable query={{ limit: 5 }} />
    </section>
  </div>
);
