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
    <div className="relative min-h-screen">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Header />

        <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* Kolom kiri - input */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[11px] font-semibold text-white">
                  1
                </span>
                <span className="text-sm font-semibold text-slate-900">Input</span>
              </div>
              <span className="text-xs text-slate-400">Sumber &amp; data mentah</span>
            </div>

            <div className="space-y-5">
              <ModeSelector mode={mode} setMode={handleModeChange} />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ShiftSelector shift={shift} setShift={setShift} />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="report-date"
                    className="text-xs font-medium text-slate-500"
                  >
                    Tanggal rekap
                  </label>
                  <input
                    id="report-date"
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>

              <RawInput
                rawText={rawText}
                setRawText={setRawText}
                placeholder={`Paste tiket ${mode} di sini...`}
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

          {/* Kolom kanan - review */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:sticky lg:top-6">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[11px] font-semibold text-white">
                  2
                </span>
                <span className="text-sm font-semibold text-slate-900">Review</span>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {reportDate.split('-').reverse().join('.')}
              </span>
            </div>

            <div className="space-y-5">
              <ResultSummary summary={summary} />
              <TicketStatus warnings={warnings} errors={errors} />

              {!output && (!summary || summary.total === 0) && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <Table2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">Belum ada hasil</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Paste tiket di kolom Input lalu klik Generate
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

        <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          Semua proses berjalan di browser &bull; data tidak dikirim ke server
        </footer>
      </div>
    </div>
  );
}
