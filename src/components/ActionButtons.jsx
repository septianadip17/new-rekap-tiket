import { Play, Trash2, CheckCheck } from 'lucide-react';

export default function ActionButtons({ onGenerate, onClear, hasOutput, onCopy, copied }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <button
        onClick={onGenerate}
        type="button"
        className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-2.5 px-6 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
      >
        <Play className="w-4 h-4 fill-current" />
        <span className="tracking-wider uppercase text-xs">Generate</span>
      </button>

      {hasOutput && (
        <button
          onClick={onCopy}
          type="button"
          className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold py-2.5 px-6 rounded-xl border border-cyan-500/30 shadow-md transition-all active:scale-[0.98]"
        >
          <CheckCheck className={`w-4 h-4 ${copied ? 'text-emerald-400' : ''}`} />
          <span className="tracking-wider uppercase text-xs">
            {copied ? 'Copied!' : 'Copy TSV'}
          </span>
        </button>
      )}

      <button
        onClick={onClear}
        type="button"
        className="flex items-center justify-center space-x-1.5 bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 py-2.5 px-4 rounded-xl border border-slate-800 hover:border-rose-500/40 transition-all text-xs font-semibold"
      >
        <Trash2 className="w-4 h-4" />
        <span>Clear</span>
      </button>
    </div>
  );
}