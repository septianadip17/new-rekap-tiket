import { useState } from "react";
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
INFORMASI : [ALARM PERANGKAT DOWN]
NAMA PELANGGAN : DINAS KOMUNIKASI DAN INFORMATIKA KAB. MUSI BANYUASIN
SID : 211601004078
ID TIKET : A0552342

TIKET 2
INFORMASI : [ALARM PERANGKAT DOWN]
NAMA PELANGGAN : SMK NEGERI 1 GUNUNG KIJANG
SID : 02000291608
ID TIKET : A0552343`;

export default function App() {
  const [mode, setMode] = useState("ALFA"); // 'ALFA' | 'INDOMARCO' | 'PUBLIK'
  const [shift, setShift] = useState("siang"); // 'pagi' | 'siang' | 'malam'
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Header />

      <main className="space-y-6">
        {/* Controls Card */}
        <div className="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModeSelector mode={mode} setMode={handleModeChange} />
            <ShiftSelector shift={shift} setShift={setShift} />
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

        {/* Feedback Section */}
        <ResultSummary summary={summary} />
        <TicketStatus warnings={warnings} errors={errors} />

        {/* Output Section */}
        <OutputPreview
          output={output}
          onCopy={handleCopy}
          copied={copied}
          mode={mode}
        />
      </main>
    </div>
  );
}
