/* eslint-disable react/prop-types */
const SHIFTS = [
  { id: 'pagi', label: 'Pagi' },
  { id: 'siang', label: 'Siang' },
  { id: 'malam', label: 'Malam' },
];

export default function ShiftSelector({ shift, setShift }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-slate-500">Shift petugas</label>
      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
        {SHIFTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShift(s.id)}
            className={`flex-1 rounded-[7px] px-3 py-1.5 text-sm font-medium transition-all ${
              shift === s.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
