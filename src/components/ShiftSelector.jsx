/* eslint-disable react/prop-types */
export default function ShiftSelector({ shift, setShift }) {
  const shifts = [
    { id: 'pagi', label: 'Pagi' },
    { id: 'siang', label: 'Siang' },
    { id: 'malam', label: 'Malam' }
  ];

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Shift Petugas
      </label>
      <div className="grid grid-cols-3 p-1 bg-slate-950/80 rounded-xl border border-slate-800 backdrop-blur-md">
        {shifts.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShift(s.id)}
            className={`py-2 text-xs font-bold rounded-lg transition-all duration-200 tracking-wider capitalize ${
              shift === s.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}