/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Copy, Check, Table2 } from 'lucide-react';

export default function OutputPreview({ output, onCopy, copied, mode }) {
  if (!output) return null;

  const lines = output.trim().split('\n');

  return (
    <div className="flex flex-col gap-2 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Table2 className="h-4 w-4 text-brand-600" />
          Output siap Excel
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
            {lines.length} baris
          </span>
        </div>
        <button
          onClick={onCopy}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy TSV
            </>
          )}
        </button>
      </div>

      <pre
        tabIndex={0}
        className="max-h-[420px] overflow-auto whitespace-pre rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-slate-100 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
      >
        {output}
      </pre>
      <p className="text-[11px] text-slate-400">
        Tekan Copy lalu paste di sel A1 Excel / Google Sheets.
      </p>
    </div>
  );
}
