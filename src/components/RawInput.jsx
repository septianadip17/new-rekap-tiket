/* eslint-disable react/prop-types */
export default function RawInput({ rawText, setRawText, placeholder }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Raw Ticket Data
        </label>
        <span className="text-[11px] text-slate-500 font-mono">
          {rawText.length > 0 ? `${rawText.split('\n').length} baris` : 'Kosong'}
        </span>
      </div>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        rows={12}
        placeholder={placeholder}
        className="w-full bg-slate-950/90 text-cyan-200 placeholder-slate-600 font-mono text-xs p-4 rounded-xl border border-slate-800/80 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 outline-none resize-y transition-all backdrop-blur-md shadow-inner"
        spellCheck="false"
      />
    </div>
  );
}