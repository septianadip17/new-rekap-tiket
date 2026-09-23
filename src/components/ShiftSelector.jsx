/* eslint-disable react/prop-types */
import { SHIFT_OPTIONS } from '../constants/modes';

export default function ShiftSelector({ shift, setShift }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
        {'shift'}
      </label>
      <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-edge bg-void/60 p-1.5">
        {SHIFT_OPTIONS.map((s) => {
          const active = shift === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setShift(s.id)}
              className={`rounded-lg px-2 py-2 font-mono text-[11px] font-semibold transition-all active:scale-[0.96] ${
                active
                  ? 'bg-violet-500/15 text-violet-300 shadow-[0_0_0_1px_rgba(167,139,250,0.25),0_0_20px_-4px_rgba(167,139,250,0.4)]'
                  : 'text-slate-500 hover:bg-panel2 hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
