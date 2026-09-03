/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Copy, Check, Table2 } from 'lucide-react';

export default function OutputPreview({ output, onCopy, copied, mode }) {
  if (!output) return null;

  const lines = output.trim().split('\n');

  return (
    <div className="flex flex-col space-y-2 mt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Table2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
            Excel-Ready Output ({lines.length} Baris • TAB Separated)
          </span>
        </div>
        <button
          onClick={onCopy}
          type="button"
          className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-mono transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy TSV</span>
            </>
          )}
        </button>
      </div>

      <div className="relative group">
        <pre
          tabIndex={0}
          className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed focus:outline-none focus:border-cyan-500/50"
        >
          {output}
        </pre>
      </div>
      <p className="text-[11px] text-slate-500 italic">
        💡 Klik tombol Copy di atas, lalu langsung tekan Paste (Ctrl+V) di sel A1 Microsoft Excel atau Google Sheets.
      </p>
    </div>
  );
}