/* eslint-disable react/prop-types */
import { Play, Trash2, CheckCheck } from 'lucide-react';

export default function ActionButtons({ onGenerate, onClear, hasOutput, onCopy, copied }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        onClick={onGenerate}
        type="button"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
      >
        <Play className="h-4 w-4 fill-current" />
        Generate
      </button>

      {hasOutput && (
        <button
          onClick={onCopy}
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <CheckCheck className={`h-4 w-4 ${copied ? 'text-emerald-500' : ''}`} />
          {copied ? 'Tersalin' : 'Copy TSV'}
        </button>
      )}

      <button
        onClick={onClear}
        type="button"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-transparent px-3.5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
      >
        <Trash2 className="h-4 w-4" />
        Hapus
      </button>
    </div>
  );
}
