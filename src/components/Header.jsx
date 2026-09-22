import { FileSpreadsheet } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pb-8">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-pop">
          <FileSpreadsheet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Ticket Rekap Generator
          </h1>
          <p className="text-sm text-slate-500">
            Ubah tiket alarm mentah jadi data siap Excel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Client-side
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
          14 kolom
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
          Excel ready
        </span>
      </div>
    </header>
  );
}
