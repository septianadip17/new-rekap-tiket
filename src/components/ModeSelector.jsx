/* eslint-disable react/prop-types */
const MODES = [
  { id: 'ALFA', label: 'Alfa' },
  { id: 'INDOMARCO', label: 'Indomarco' },
  { id: 'PUBLIK', label: 'Publik' },
];

export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-slate-500">Mode sumber tiket</label>
      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`flex-1 rounded-[7px] px-3 py-1.5 text-sm font-medium transition-all ${
              mode === m.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
