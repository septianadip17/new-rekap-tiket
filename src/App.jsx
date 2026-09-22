import { useState } from "react";
import { Table2 } from "lucide-react";
import Header from "./components/Header";
import ModeSelector from "./components/ModeSelector";
import ShiftSelector from "./components/ShiftSelector";
import RawInput from "./components/RawInput";
import ActionButtons from "./components/ActionButtons";
import ResultSummary from "./components/ResultSummary";
import TicketStatus from "./components/TicketStatus";
import OutputPreview from "./components/OutputPreview";

import { parseAlfaTickets } from "./parsers/alfaParser";
import { parsePublikTickets } from "./parsers/publikParser";
import { parseIndomarcoTickets } from "./parsers/indomarcoParser";
import { copyToClipboard } from "./utils/clipboard";

const SAMPLE_ALFA = `INFORMASI : [ALARM PERANGKAT DOWN]
SITE : BANDUNG-B997-MALAYU_SAMARANG
ALAMAT TERMINASI : JL. RAYA SAMARANG NO. 45
SID IBBC : 111401005785
TITIK KORDINAT : -7.213, 107.892
KELUHAN : Perangkat down
ID TIKET : A0536517
Pengecekan UPE : UP
Pengecekan SPE : DOWN
Pengecekan CPE : UP

TIKET 2
INFORMASI : [ALARM PERANGKAT DOWN]
SITE : SIDOARJO-U659-TRASAK
ALAMAT TERMINASI : JL. TRASAK RAYA
SID IPVPN : 222501009988
ID TIKET : A0536522
Pengecekan UPE : UP
Pengecekan SPE : UP
Pengecekan CPE : -`;

const SAMPLE_INDOMARCO = `INFORMASI	 : [ALARM PERANGKAT DOWN]
SITE		 : BALI-TFDH
ALAMAT TERMINASI : BALI-MTRM.SELONG-ZYXEL.MGS3520-SPE-03	172.25.183.222	Interface e0/0/10
SID IBBC	 : 111302004256
TITIK KORDINAT 	 : -8.705354,116.502972
KELUHAN 	 : TERMONITOR DOWN DARI LOG DC DAWUAN, CONNECTIVITY VIA FO DOWN, INDIKASI GANGGUAN FO DARI POP KE ARAH LAST MILE.
ID TIKET	 : A0560219
Pengecekan UPE	 :
Pengecekan SPE	 : port link down
Pengecekan CPE	 :`;

const SAMPLE_PUBLIK = `TIKET 1
Berikut kami sampaikan informasi terkait alarm proaktif:
Deskripsi Alarm:
SID               :	111604007829
NAMA PELANGGAN    :	PERKEBUNAN NUSANTARA 1
IP                :	172.26.195.114
ALARM START       :	2026-09-20 04:56:15
ALARM             :	UNAVAILABLE BY ICMP PING
STATUS PENGECEKAN :	DOWN
INDIKASI GANGGUAN :	LOSS POWER DI SISI PELANGGAN
Mohon konfirmasi terkait alarm tersebut, Mas.
Terima kasih	
ID TIKET          :	A0559235
Pengecekan UPE	  : 
Pengecekan SPE	  : port link down
Pengecekan CPE	  :`;

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [mode, setMode] = useState("ALFA"); // 'ALFA' | 'INDOMARCO' | 'PUBLIK'
  const [shift, setShift] = useState("siang"); // 'pagi' | 'siang' | 'malam'
  const [reportDate, setReportDate] = useState(todayISO());
  const [rawText, setRawText] = useState(SAMPLE_ALFA);
  const [output, setOutput] = useState("");
  const [summary, setSummary] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setOutput("");
    setSummary(null);
    setWarnings([]);
    setErrors([]);

    // Update sample text jika textarea masih berupa sample bawaan
    const isCurrentSample =
      rawText === SAMPLE_ALFA ||
      rawText === SAMPLE_INDOMARCO ||
      rawText === SAMPLE_PUBLIK;

    if (isCurrentSample) {
      if (newMode === "ALFA") setRawText(SAMPLE_ALFA);
      else if (newMode === "INDOMARCO") setRawText(SAMPLE_INDOMARCO);
      else if (newMode === "PUBLIK") setRawText(SAMPLE_PUBLIK);
    }
  };

  const handleGenerate = () => {
    if (!rawText.trim()) {
      setOutput("");
      setSummary(null);
      setWarnings([]);
      setErrors([
        "Raw data tiket masih kosong. Silakan paste tiket terlebih dahulu.",
      ]);
      return;
    }

    let parseResult;
    if (mode === "ALFA") {
      parseResult = parseAlfaTickets(rawText, shift);
    } else if (mode === "INDOMARCO") {
      parseResult = parseIndomarcoTickets(rawText, shift);
    } else {
      parseResult = parsePublikTickets(rawText, shift);
    }

    setOutput(parseResult.rawOutput);
    setSummary(parseResult.summary);
    setWarnings(parseResult.warnings);
    setErrors(parseResult.errors);
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
    setRawText("");
    setOutput("");
    setSummary(null);
    setWarnings([]);
    setErrors([]);
  };

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
            <div className="mb-5 flex items-center justify-between border-b border-edge pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-400/10 font-mono text-[11px] font-bold text-cyan-300">
                  01
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">
                  input
                </span>
              </div>
              <span className="hidden font-mono text-[11px] text-slate-600 sm:block">
                struktur_data
              </span>
            </div>

            <div className="space-y-5">
              <ModeSelector mode={mode} setMode={handleModeChange} />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ShiftSelector shift={shift} setShift={setShift} />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="report-date"
                    className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500"
                  >
                    // tanggal_rekap
                  </label>
                  <input
                    id="report-date"
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full rounded-xl border border-edge bg-void/70 px-4 py-2.5 font-mono text-sm text-slate-300 outline-none transition focus:border-cyan-400/40 focus:shadow-glow"
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
                hasOutput={Boolean(output)}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>
          </section>

          {/* Panel Review */}
          <section className="glass rounded-2xl border border-edge p-5 shadow-panel sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-edge pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-violet-400/30 bg-violet-400/10 font-mono text-[11px] font-bold text-violet-300">
                  02
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">
                  review
                </span>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-slate-600">
                {reportDate.split('-').reverse().join('.')}
              </span>
            </div>

            <div className="space-y-5">
              <ResultSummary summary={summary} />
              <TicketStatus warnings={warnings} errors={errors} />

              {!output && (!summary || summary.total === 0) && (
                <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-edge bg-void/40 px-6 py-16 text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-cyan-400">
                    <Table2 className="h-4 w-4" />
                  </div>
                  <p className="font-mono text-xs text-slate-400">
                    awaiting_input...
                  </p>
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
