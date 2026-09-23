import {
  splitTicketBlocks,
  extractField,
  sanitizeStatus,
  buildTicketLabel,
  buildParseResult,
} from './parserUtils';
import { getIndonesianDate } from '../utils/dateUtils';
import { buildRow } from '../utils/validation';

/**
 * Mengubah SITE mentah menjadi "Alfa <kode 4 digit>" (mis. "Alfa Q213").
 */
export function parseAlfaSite(siteRaw) {
  if (!siteRaw) return '';
  const parts = siteRaw.split('-');
  if (parts.length >= 2 && parts[1].trim().length >= 4) {
    const code = parts[1].trim().substring(0, 4).toUpperCase();
    return `Alfa ${code}`;
  }
  return '';
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

    const ticketId = extractField(block, 'ID\\s*TIKET') || '';
    const ticketLabel = buildTicketLabel(ticketId, ticketNum);
    if (!ticketId) warningsForThisTicket.push('ID TIKET kosong');

    const sidIbbc = extractField(block, 'SID\\s*IBBC');
    const sidIpvpn = extractField(block, 'SID\\s*IPVPN');
    const sid = sidIbbc || sidIpvpn || '';
    if (!sid) warningsForThisTicket.push('SID tidak ditemukan');

    const siteRaw = extractField(block, 'SITE');
    const namaAlfa = parseAlfaSite(siteRaw);
    if (!namaAlfa) warningsForThisTicket.push('SITE kosong atau kode toko tidak sesuai');

    const cpe = sanitizeStatus(extractField(block, 'Pengecekan\\s*CPE'));
    const spe = sanitizeStatus(extractField(block, 'Pengecekan\\s*SPE'));
    const upe = sanitizeStatus(extractField(block, 'Pengecekan\\s*UPE'));

    const rowCells = [
      sid,                              // 1: SID
      namaAlfa,                         // 2: Nama Alfa
      '',                               // 3: kosong
      'Termonitor perangkat down',      // 4: status
      'aktif',                          // 5: aktif
      '',                               // 6: kosong
      '',                               // 7: kosong
      cpe,                              // 8: CPE
      spe,                              // 9: SPE
      upe,                              // 10: UPE
      '',                               // 11: kosong
      ticketId,                         // 12: ID Tiket
      shift,                            // 13: Shift
      currentDate,                      // 14: Tanggal
    ];

    try {
      tsvRows.push(buildRow(rowCells, ticketLabel));
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
        warnings: warningsForThisTicket,
      });
    } catch (err) {
      errors.push(`${ticketLabel}: ${err.message}`);
    }

    if (warningsForThisTicket.length > 0) {
      warnings.push({ ticket: ticketLabel, messages: warningsForThisTicket });
    }
  });

  return buildParseResult({
    tsvRows,
    results,
    warnings,
    errors,
    total: blocks.length,
  });
}
