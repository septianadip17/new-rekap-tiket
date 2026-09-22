import { Terminal, Zap, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative flex flex-col gap-5 pb-7 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400 shadow-glow">
          <Terminal className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse-glow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">
              TICKET<span className="text-gradient">REKAP</span>
            </h1>
            <span className="rounded-md border border-cyan-400/20 bg-cyan-400/5 px-1.5 py-0.5 font-mono text-[10px] font-medium text-cyan-400">
              v1.0
            </span>
          </div>
          <p className="mt-0.5 font-mono text-xs text-slate-500">
            raw alarm &rarr; excel-ready pipeline
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1.5 font-mono text-[11px] text-cyan-300">
          <Zap className="h-3 w-3" />
          14 col
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/20 bg-violet-400/5 px-2.5 py-1.5 font-mono text-[11px] text-violet-300">
          <ShieldCheck className="h-3 w-3" />
          client-side
        </span>
      </div>
    </header>
  );
}
