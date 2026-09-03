import { splitTicketBlocks, extractField } from './parserUtils';
import { getIndonesianDate } from '../utils/dateUtils';
import { buildRow } from '../utils/validation';


/**
 * Parsing kode toko ALFA dari SITE (4 karakter setelah strip pertama).
 * Contoh: BANDUNG-B997-MALAYU_SAMARANG -> B997 -> Alfa B997
 */
export function parseAlfaSite(siteRaw) {
  if (!siteRaw) return null;
  const parts = siteRaw.split('-');
  if (parts.length >= 2 && parts[1].trim().length >= 4) {
    const code = parts[1].trim().substring(0, 4).toUpperCase();
    return `Alfa ${code}`;
  }
  return null;
}

/**
 * Parsing pengecekan port/device (UP/DOWN dsb).
 * Mengabaikan karakter placeholder seperti "-" atau whitespace.
 */
export function sanitizeStatus(val) {
  if (!val) return '';
  const trimmed = val.trim();
  if (trimmed === '-' || trimmed === '--' || trimmed.toLowerCase() === 'null') {
    return '';
  }
  return trimmed;
}

export function parseAlfaTickets(rawText, shift = 'siang') {
  const blocks = splitTicketBlocks(rawText);
  const currentDate = getIndonesianDate();

  const results = [];
  const warnings = [];
  const errors = [];
  const tsvRows = [];

  blocks.forEach((block, index) => {
    const ticketNum = index + 1;
    const warningsForThisTicket = [];

    // 1. Ekstraksi ID Tiket
    const ticketId = extractField(block, 'ID\\s*TIKET') || '';
    const ticketLabel = ticketId ? `Tiket ${ticketId}` : `Tiket #${ticketNum}`;

    // 2. Ekstraksi SID (Prioritas: SID IBBC, fallback: SID IPVPN)
    const sidIbbc = extractField(block, 'SID\\s*IBBC');
    const sidIpvpn = extractField(block, 'SID\\s*IPVPN');
    
    let sid = '';
    if (sidIbbc) {
      sid = sidIbbc;
    } else if (sidIpvpn) {
      sid = sidIpvpn;
    } else {
      warningsForThisTicket.push('SID (IBBC / IPVPN) tidak ditemukan');
    }

    // 3. Ekstraksi SITE
    const siteRaw = extractField(block, 'SITE');
    let namaAlfa = '';
    if (siteRaw) {
      const parsedSite = parseAlfaSite(siteRaw);
      if (parsedSite) {
        namaAlfa = parsedSite;
      } else {
        warningsForThisTicket.push(`Format SITE tidak standar ("${siteRaw}")`);
      }
    } else {
      warningsForThisTicket.push('Field SITE tidak ditemukan');
    }

    // 4. Ekstraksi Pengecekan
    const upeRaw = extractField(block, 'Pengecekan\\s*UPE');
    const speRaw = extractField(block, 'Pengecekan\\s*SPE');
    const cpeRaw = extractField(block, 'Pengecekan\\s*CPE');

    const cpe = sanitizeStatus(cpeRaw);
    const spe = sanitizeStatus(speRaw);
    const upe = sanitizeStatus(upeRaw);

    if (!cpe) warningsForThisTicket.push('Pengecekan CPE kosong');
    if (!spe) warningsForThisTicket.push('Pengecekan SPE kosong');
    if (!upe) warningsForThisTicket.push('Pengecekan UPE kosong');
    if (!ticketId) warningsForThisTicket.push('ID TIKET tidak ditemukan');

    // 5. Konstruksi 14 Kolom ALFA:
    // 1: SID
    // 2: Nama Alfa
    // 3: kosong
    // 4: Termonitor perangkat down
    // 5: aktif
    // 6: kosong
    // 7: kosong
    // 8: Pengecekan CPE
    // 9: Pengecekan SPE
    // 10: Pengecekan UPE
    // 11: kosong
    // 12: ID Tiket
    // 13: Shift
    // 14: Tanggal
    const rowCells = [
      sid,                              // Col 1
      namaAlfa,                         // Col 2
      '',                               // Col 3
      'Termonitor perangkat down',      // Col 4
      'aktif',                          // Col 5
      '',                               // Col 6
      '',                               // Col 7
      cpe,                              // Col 8 (CPE)
      spe,                              // Col 9 (SPE)
      upe,                              // Col 10 (UPE)
      '',                               // Col 11
      ticketId,                         // Col 12
      shift,                            // Col 13
      currentDate                       // Col 14
    ];

    try {
      const tsvLine = buildRow(rowCells, ticketLabel);
      tsvRows.push(tsvLine);

      results.push({
        id: ticketLabel,
        sid,
        nama: namaAlfa,
        ticketId,
        cpe,
        spe,
        upe,
        shift,
        date: currentDate,
        status: warningsForThisTicket.length > 0 ? 'WARNING' : 'SUCCESS',
        warnings: warningsForThisTicket
      });
    } catch (err) {
      errors.push(`${ticketLabel}: ${err.message}`);
    }

    if (warningsForThisTicket.length > 0) {
      warnings.push({
        ticket: ticketLabel,
        messages: warningsForThisTicket
      });
    }
  });

  return {
    rawOutput: tsvRows.join('\n'),
    results,
    summary: {
      total: blocks.length,
      success: results.filter(r => r.status === 'SUCCESS').length,
      warning: warnings.length,
      error: errors.length
    },
    warnings,
    errors
  };
}