/* eslint-disable react/prop-types */
const ACCENTS = {
  cyan: {
    badge: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  },
  violet: {
    badge: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  },
};

export default function PanelHeader({ index, title, accent = 'cyan', hint }) {
  const style = ACCENTS[accent] ?? ACCENTS.cyan;

  return (
    <div className="mb-5 flex items-center justify-between border-b border-edge pb-4">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md border font-mono text-[11px] font-bold ${style.badge}`}
        >
          {index}
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">
          {title}
        </span>
      </div>
      {hint && (
        <span className="hidden font-mono text-[11px] tabular-nums text-slate-600 sm:block">
          {hint}
        </span>
      )}
    </div>
  );
}
