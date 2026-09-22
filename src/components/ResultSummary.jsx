/* eslint-disable react/prop-types */
import { CheckCircle2, AlertTriangle, XCircle, Ticket } from 'lucide-react';

export default function ResultSummary({ summary }) {
  if (!summary || summary.total === 0) return null;

  const items = [
    { label: 'diproses', value: summary.total, Icon: Ticket, tone: 'text-cyan-300', ring: 'border-cyan-400/25 bg-cyan-400/5' },
    { label: 'berhasil', value: summary.success, Icon: CheckCircle2, tone: 'text-emerald-400', ring: 'border-emerald-400/25 bg-emerald-400/5' },
    { label: 'peringatan', value: summary.warning, Icon: AlertTriangle, tone: 'text-amber-400', ring: 'border-amber-400/25 bg-amber-400/5' },
    { label: 'error', value: summary.error, Icon: XCircle, tone: 'text-rose-400', ring: 'border-rose-400/25 bg-rose-400/5' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ label, value, tone, ring, Icon }) => (
        <div
          key={label}
          className={`rounded-xl border ${ring} p-3.5 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between">
            <Icon className={`h-4 w-4 ${tone}`} />
            <span className={`font-mono text-2xl font-bold tabular-nums ${tone}`}>
              {value}
            </span>
          </div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
