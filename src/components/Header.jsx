import { ShieldAlert, Terminal } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl mb-8 shadow-2xl shadow-cyan-950/20">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 rounded-xl text-cyan-400">
          <Terminal className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              TICKET REKAP GENERATOR
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            Convert raw alarm tickets into Excel-ready data • 14 Column Auto-Validator
          </p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-emerald-400" />
        <span>100% Client-Side In-Memory Engine</span>
      </div>
    </header>
  );
}