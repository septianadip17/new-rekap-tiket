/* eslint-disable react/prop-types */
import { Play, Trash2, CheckCheck } from 'lucide-react';

export default function ActionButtons({ onGenerate, onClear, hasOutput, onCopy, copied }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onGenerate}
        type="button"
        className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-bold text-void transition-all hover:shadow-glow active:scale-[0.97]"
      >
        <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
        <Play className="h-4 w-4 fill-current" />
        Generate
      </button>

      {hasOutput && (
        <button
          onClick={onCopy}
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-edge bg-panel2 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-cyan-400/40 hover:text-white active:scale-[0.97]"
        >
          <CheckCheck className={`h-4 w-4 ${copied ? 'text-emerald-400' : ''}`} />
          {copied ? 'Tersalin' : 'Copy TSV'}
        </button>
      )}

      <button
        onClick={onClear}
        type="button"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 active:scale-[0.97]"
      >
        <Trash2 className="h-4 w-4" />
        Hapus
      </button>
    </div>
  );
}
