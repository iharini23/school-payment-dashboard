import { useState } from 'react';
import { TransactionsTable } from '../components/TransactionsTable';
import { TransactionsQuery } from '../api/transactions';

const STATUS_OPTIONS = ['success', 'pending', 'failed'];

export const TransactionsPage = () => {
  const [filters, setFilters] = useState<TransactionsQuery>({});

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-sm text-slate-400">
          Review historical payment events. Use the filters below to refine your search across
          status, school, or date range.
        </p>
      </header>

      <section className="flex flex-wrap gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
        <label className="flex flex-col gap-1">
          <span>Status</span>
          <select
            defaultValue=""
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                statuses: event.target.value ? [event.target.value] : undefined,
              }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>School ID</span>
          <input
            type="text"
            placeholder="SCH-001"
            onBlur={(event) =>
              setFilters((prev) => ({
                ...prev,
                school_id: event.target.value || undefined,
              }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>From date</span>
          <input
            type="date"
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                from_date: event.target.value || undefined,
              }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>To date</span>
          <input
            type="date"
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                to_date: event.target.value || undefined,
              }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>
      </section>

      <TransactionsTable query={filters} />
    </div>
  );
};
