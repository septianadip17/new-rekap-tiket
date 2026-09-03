import { useState } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ShiftSelector from './components/ShiftSelector';
import RawInput from './components/RawInput';
import ActionButtons from './components/ActionButtons';
import ResultSummary from './components/ResultSummary';
import TicketStatus from './components/TicketStatus';
import OutputPreview from './components/OutputPreview';

import { parseAlfaTickets } from './parsers/alfaParser';
import { parsePublikTickets } from './parsers/publikParser';
import { copyToClipboard } from './utils/clipboard';

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

const SAMPLE_PUBLIK = `TIKET 1
INFORMASI : [ALARM PERANGKAT DOWN]
NAMA PELANGGAN : JKT-ICONPLUS_VVIP_WAMEN_KOMDIGI
SID : 333100021
ID TIKET : IN3849102

TIKET 2
INFORMASI : [ALARM PERANGKAT DOWN]
NAMA PELANGGAN : JATIM-DISKOMINFO.TUBAN.DESA.JETAK.MONTONG-RB2011-CPE-01
SID IPVPN : 555200034
ID TIKET : IN3849103`;

export default function App() {
  const [mode, setMode] = useState('ALFA'); // 'ALFA' | 'PUBLIK'
  const [shift, setShift] = useState('siang'); // 'pagi' | 'siang' | 'malam'
  const [rawText, setRawText] = useState(SAMPLE_ALFA);
  const [output, setOutput] = useState('');
  const [summary, setSummary] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setOutput('');
    setSummary(null);
    setWarnings([]);
    setErrors([]);
    // Berikan template contoh sesuai mode jika textarea masih kosong atau berisi default
    if (rawText === SAMPLE_ALFA && newMode === 'PUBLIK') {
      setRawText(SAMPLE_PUBLIK);
    } else if (rawText === SAMPLE_PUBLIK && newMode === 'ALFA') {
      setRawText(SAMPLE_ALFA);
    }
  };

  const handleGenerate = () => {
    if (!rawText.trim()) {
      setOutput('');
      setSummary(null);
      setWarnings([]);
      setErrors(['Raw data tiket masih kosong. Silakan paste tiket terlebih dahulu.']);
      return;
    }

    let parseResult;
    if (mode === 'ALFA') {
      parseResult = parseAlfaTickets(rawText, shift);
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
    setRawText('');
    setOutput('');
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
            placeholder={
              mode === 'ALFA'
                ? 'Paste tiket ALFA di sini (mendukung multiple tickets)...'
                : 'Paste tiket PUBLIK di sini (mendukung multiple tickets)...'
            }
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