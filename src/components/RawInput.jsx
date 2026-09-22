/* eslint-disable react/prop-types */
import { CornerDownLeft } from 'lucide-react';

export default function RawInput({ rawText, setRawText, placeholder }) {
  const lineCount = rawText.length > 0 ? rawText.split('\n').length : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-500">Data tiket mentah</label>
        <span className="font-mono text-[11px] text-slate-400">
          {lineCount > 0 ? `${lineCount} baris` : 'kosong'}
        </span>
      </div>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        rows={12}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
        spellCheck="false"
      />
      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <CornerDownLeft className="h-3 w-3" />
        Pisahkan tiket dengan baris kosong atau penanda <span className="font-mono">TIKET n</span>
      </p>
    </div>
  );
}
