/* eslint-disable react/prop-types */
import { AlertCircle, AlertTriangle } from 'lucide-react';

export default function TicketStatus({ warnings, errors }) {
  if (warnings.length === 0 && errors.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 animate-fade-up">
      {errors.length > 0 && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-rose-400">
            <AlertCircle className="h-4 w-4" />
            error &bull; {errors.length}
          </div>
          <ul className="list-inside list-disc space-y-1 font-mono text-xs text-rose-300/80">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            data_tidak_lengkap &bull; {warnings.length}
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-slate-400">
            {warnings.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-semibold text-amber-300">[{w.ticket}]</span>
                <span>{w.messages.join(', ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
