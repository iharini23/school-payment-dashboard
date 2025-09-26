import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchTransactions, TransactionsQuery } from '../api/transactions';
import { TransactionItem } from '../types';
import { StatusBadge } from './StatusBadge';

dayjs.extend(relativeTime);

type TransactionsTableProps = {
  query?: TransactionsQuery;
};

export const TransactionsTable = ({ query }: TransactionsTableProps) => {
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(() => query ?? {}, [query]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTransactions(filters);
        setItems(response.data.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [filters]);

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading transactions…</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-300">{error}</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-slate-400">No transactions to show yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold uppercase tracking-widest">Collect ID</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-widest">Order ID</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-widest">School</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-widest">Gateway</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-widest">Amount</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-widest">Status</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-widest">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-200">
          {items.map((item) => (
            <tr key={item.collect_id} className="hover:bg-slate-900/60">
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{item.collect_id}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{item.custom_order_id}</td>
              <td className="px-4 py-3">{item.school_id}</td>
              <td className="px-4 py-3">{item.gateway}</td>
              <td className="px-4 py-3">₹{item.transaction_amount.toFixed(2)}</td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-slate-400">
                {item.payment_time ? dayjs(item.payment_time).fromNow() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
