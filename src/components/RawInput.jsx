/* eslint-disable react/prop-types */
import { CornerDownLeft } from 'lucide-react';

export default function RawInput({ rawText, setRawText, placeholder }) {
  const lineCount = rawText.length > 0 ? rawText.split('\n').length : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
          // raw_ticket
        </label>
        <span className="font-mono text-[11px] text-slate-500">
          {lineCount > 0 ? `${lineCount} lines` : 'empty'}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-edge bg-void/70 transition focus-within:border-cyan-400/40 focus-within:shadow-glow">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px glow-line" />
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={12}
          placeholder={placeholder}
          className="w-full resize-y bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-300 placeholder:text-slate-600 outline-none"
          spellCheck="false"
        />
      </div>
      <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
        <CornerDownLeft className="h-3 w-3" />
        pisah tiket dengan baris kosong atau <span className="text-slate-500">TIKET n</span>
      </p>
    </div>
  );
}
