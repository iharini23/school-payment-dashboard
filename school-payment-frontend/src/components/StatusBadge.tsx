import clsx from 'clsx';

const STATUS_CLASS_MAP: Record<string, string> = {
  success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
  failed: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
  paid: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  partial: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
  refunded: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
};

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normalized = status.toLowerCase();
  const classes = STATUS_CLASS_MAP[normalized] ?? 'bg-slate-700/50 text-slate-200 border border-slate-600';

  return <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold uppercase', classes)}>{status}</span>;
};
