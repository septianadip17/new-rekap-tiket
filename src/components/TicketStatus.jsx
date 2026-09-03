/* eslint-disable react/prop-types */
import { AlertCircle, AlertTriangle } from 'lucide-react';

export default function TicketStatus({ warnings, errors }) {
  if (warnings.length === 0 && errors.length === 0) return null;

  return (
    <div className="flex flex-col space-y-3">
      {errors.length > 0 && (
        <div className="p-4 bg-rose-950/40 border border-rose-600/50 rounded-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Kritikal Error ({errors.length})</span>
          </div>
          <ul className="list-disc list-inside text-xs font-mono text-rose-300 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Peringatan Data Kosong / Tidak Lengkap ({warnings.length})</span>
          </div>
          <ul className="space-y-1.5 text-xs font-mono text-amber-200">
            {warnings.map((w, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="font-semibold text-amber-300">[{w.ticket}]:</span>
                <span className="text-slate-300">{w.messages.join(', ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}