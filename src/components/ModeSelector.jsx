/* eslint-disable react/prop-types */
export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Mode Aplikasi
      </label>
      <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setMode('ALFA')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 tracking-wider flex items-center justify-center space-x-2 ${
            mode === 'ALFA'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <span>ALFA (14 KOLOM)</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('PUBLIK')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 tracking-wider flex items-center justify-center space-x-2 ${
            mode === 'PUBLIK'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <span>PUBLIK (14 KOLOM)</span>
        </button>
      </div>
    </div>
  );
}