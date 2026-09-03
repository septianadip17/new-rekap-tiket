/* eslint-disable react/prop-types */
import { CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react';

export default function ResultSummary({ summary }) {
  if (!summary || summary.total === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl backdrop-blur-md">
      <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
        <FileText className="w-5 h-5 text-sky-400" />
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Tiket</div>
          <div className="text-lg font-mono font-bold text-sky-400">{summary.total}</div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Success</div>
          <div className="text-lg font-mono font-bold text-emerald-400">{summary.success}</div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 rounded-lg bg-amber-950/20 border border-amber-800/40">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Warning</div>
          <div className="text-lg font-mono font-bold text-amber-400">{summary.warning}</div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 rounded-lg bg-rose-950/20 border border-rose-800/40">
        <XCircle className="w-5 h-5 text-rose-400" />
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Error</div>
          <div className="text-lg font-mono font-bold text-rose-400">{summary.error}</div>
        </div>
      </div>
    </div>
  );
}