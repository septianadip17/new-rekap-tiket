/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Copy, Check, Table2 } from 'lucide-react';

export default function OutputPreview({ output, onCopy, copied, mode }) {
  if (!output) return null;

  const lines = output.trim().split('\n');

  return (
    <div className="flex flex-col gap-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400">
          <Table2 className="h-4 w-4 text-cyan-400" />
          excel_ready_output
          <span className="rounded-md border border-edge bg-void/60 px-1.5 py-0.5 tabular-nums text-slate-500">
            {lines.length} rows
          </span>
        </div>
        <button
          onClick={onCopy}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-edge bg-panel2 px-3 py-1.5 font-mono text-[11px] text-slate-400 transition-all hover:border-cyan-400/40 hover:text-cyan-300 active:scale-[0.96]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              copy_tsv
            </>
          )}
        </button>
      </div>

      <pre
        tabIndex={0}
        className="max-h-[460px] overflow-auto whitespace-pre rounded-xl border border-edge bg-void/80 p-4 font-mono text-[11px] leading-relaxed text-cyan-100/90 focus:outline-none focus:border-cyan-400/40 focus:shadow-glow"
      >
        {output}
      </pre>
      <p className="font-mono text-[11px] text-slate-600">
        copy lalu paste di sel A1 Excel / Google Sheets
      </p>
    </div>
  );
}
