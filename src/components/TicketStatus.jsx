/* eslint-disable react/prop-types */
import { AlertCircle, AlertTriangle } from 'lucide-react';

export default function TicketStatus({ warnings, errors }) {
  if (warnings.length === 0 && errors.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 animate-fade-up">
      {errors.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4" />
            Error ({errors.length})
          </div>
          <ul className="list-inside list-disc space-y-1 text-xs text-rose-600">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Data tidak lengkap ({warnings.length})
          </div>
          <ul className="space-y-1.5 text-xs text-amber-700">
            {warnings.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono font-semibold text-amber-800">[{w.ticket}]</span>
                <span className="text-slate-600">{w.messages.join(', ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
