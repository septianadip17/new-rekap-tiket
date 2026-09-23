import { useState } from 'react';
import { Table2 } from 'lucide-react';

import Header from './components/Header';
import PanelHeader from './components/PanelHeader';
import ModeSelector from './components/ModeSelector';
import ShiftSelector from './components/ShiftSelector';
import RawInput from './components/RawInput';
import ActionButtons from './components/ActionButtons';
import ResultSummary from './components/ResultSummary';
import TicketStatus from './components/TicketStatus';
import OutputPreview from './components/OutputPreview';

import { parseAlfaTickets } from './parsers/alfaParser';
import { parsePublikTickets } from './parsers/publikParser';
import { parseIndomarcoTickets } from './parsers/indomarcoParser';
import { copyToClipboard } from './utils/clipboard';

import { MODES, DEFAULT_MODE, DEFAULT_SHIFT } from './constants/modes';
import {
  SAMPLE_ALFA,
  SAMPLE_INDOMARCO,
  SAMPLE_PUBLIK,
} from './constants/samples';

const SAMPLE_BY_MODE = {
  [MODES.ALFA]: SAMPLE_ALFA,
  [MODES.INDOMARCO]: SAMPLE_INDOMARCO,
  [MODES.PUBLIK]: SAMPLE_PUBLIK,
};

const PARSER_BY_MODE = {
  [MODES.ALFA]: parseAlfaTickets,
  [MODES.INDOMARCO]: parseIndomarcoTickets,
  [MODES.PUBLIK]: parsePublikTickets,
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [shift, setShift] = useState(DEFAULT_SHIFT);
  const [reportDate, setReportDate] = useState(todayISO());
  const [rawText, setRawText] = useState(SAMPLE_ALFA);
  const [output, setOutput] = useState('');
  const [summary, setSummary] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [copied, setCopied] = useState(false);

  const resetResult = () => {
    setOutput('');
    setSummary(null);
    setWarnings([]);
    setErrors([]);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetResult();

    // Ganti sample hanya bila textarea masih berisi sample bawaan
    const isShowingSample = Object.values(SAMPLE_BY_MODE).includes(rawText);
    if (isShowingSample) {
      setRawText(SAMPLE_BY_MODE[newMode]);
    }
  };

  const handleGenerate = () => {
    if (!rawText.trim()) {
      resetResult();
      setErrors([
        'Raw data tiket masih kosong. Silakan paste tiket terlebih dahulu.',
      ]);
      return;
    }

    const parse = PARSER_BY_MODE[mode];
    const result = parse(rawText, shift);

    setOutput(result.rawOutput);
    setSummary(result.summary);
    setWarnings(result.warnings);
    setErrors(result.errors);
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setRawText('');
    resetResult();
  };

  const hasResult = Boolean(output);
  const isIdle = !hasResult && (!summary || summary.total === 0);
  const formattedDate = reportDate.split('-').reverse().join('.');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Header />

        <main className="space-y-6">
          {/* Panel Input */}
          <section className="glass rounded-2xl border border-edge p-5 shadow-panel sm:p-6">
            <PanelHeader index="01" title="input" accent="cyan" hint="struktur_data" />

            <div className="space-y-5">
              <ModeSelector mode={mode} setMode={handleModeChange} />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ShiftSelector shift={shift} setShift={setShift} />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="report-date"
                    className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500"
                  >
                    {'// tanggal_rekap'}
                  </label>
                  <input
                    id="report-date"
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full rounded-xl border border-edge bg-void/70 px-4 py-2.5 font-mono text-sm text-white outline-none transition focus:border-cyan-400/40 focus:shadow-glow"
                  />
                </div>
              </div>

              <RawInput
                rawText={rawText}
                setRawText={setRawText}
                placeholder={`Paste tiket ${mode} di sini (mendukung multiple tickets)...`}
              />

              <ActionButtons
                onGenerate={handleGenerate}
                onClear={handleClear}
                hasOutput={hasResult}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>
          </section>

          {/* Panel Review */}
          <section className="glass rounded-2xl border border-edge p-5 shadow-panel sm:p-6">
            <PanelHeader
              index="02"
              title="review"
              accent="violet"
              hint={formattedDate}
            />

            <div className="space-y-5">
              <ResultSummary summary={summary} />
              <TicketStatus warnings={warnings} errors={errors} />

              {isIdle && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-edge bg-void/40 px-6 py-16 text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-cyan-400">
                    <Table2 className="h-4 w-4" />
                  </div>
                  <p className="font-mono text-xs text-slate-400">awaiting_input...</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-600">
                    paste tiket di panel 01 lalu generate
                  </p>
                </div>
              )}

              <OutputPreview
                output={output}
                onCopy={handleCopy}
                copied={copied}
                mode={mode}
              />
            </div>
          </section>
        </main>

        <footer className="mt-10 flex items-center justify-center gap-2 border-t border-edge pt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          in-memory pipeline &bull; data tidak keluar browser
        </footer>
      </div>
    </div>
  );
}
