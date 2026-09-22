/* eslint-disable react/prop-types */
import { CheckCircle2, AlertTriangle, XCircle, Ticket } from 'lucide-react';

export default function ResultSummary({ summary }) {
  if (!summary || summary.total === 0) return null;

  const items = [
    { label: 'Tiket diproses', value: summary.total, tone: 'text-slate-900', bg: 'bg-slate-100', Icon: Ticket },
    { label: 'Berhasil', value: summary.success, tone: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle2 },
    { label: 'Peringatan', value: summary.warning, tone: 'text-amber-600', bg: 'bg-amber-50', Icon: AlertTriangle },
    { label: 'Error', value: summary.error, tone: 'text-rose-600', bg: 'bg-rose-50', Icon: XCircle },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ label, value, tone, bg, Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card"
        >
          <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
            <Icon className={`h-4 w-4 ${tone}`} />
          </div>
          <div className={`text-2xl font-semibold tabular-nums ${tone}`}>{value}</div>
          <div className="mt-0.5 text-xs text-slate-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
