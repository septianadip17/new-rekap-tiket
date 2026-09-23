/* eslint-disable react/prop-types */
import { MODE_OPTIONS } from '../constants/modes';

export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
        {'jenis pelanggan'}
      </label>
      <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-edge bg-void/60 p-1.5">
        {MODE_OPTIONS.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-2 py-2 font-mono text-[11px] font-semibold transition-all active:scale-[0.96] ${
                active
                  ? 'bg-cyan-500/15 text-cyan-300 shadow-glow'
                  : 'text-slate-500 hover:bg-panel2 hover:text-slate-300'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
