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
 * Mengubah SITE mentah menjadi "Indomarco <Region> <Kode>"
 * (mis. "BALI-TFDH" -> "Indomarco Bali TFDH").
 */
export function parseIndomarcoSite(siteRaw) {
  if (!siteRaw) return '';
  const parts = siteRaw.split('-');
  if (parts.length >= 2) {
    const region = parts[0].trim().toLowerCase();
    const regionTitle = region.charAt(0).toUpperCase() + region.slice(1);
    const siteCode = parts[1].trim().toUpperCase();
    return `Indomarco ${regionTitle} ${siteCode}`;
  }
  return `Indomarco ${siteRaw.trim()}`;
}

export function parseIndomarcoTickets(rawText, shift = 'siang') {
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

    // Prioritas SID: IBBC -> MS SDWAN -> ICL -> SID generik
    const sidIbbc = extractField(block, 'SID\\s*IBBC');
    const sidIcl = extractField(block, 'SID\\s*ICL');
    const sidMsSdwan = extractField(block, 'SID\\s*MS SDWAN');
    const sidGeneric = extractField(block, 'SID');
    const sid = sidIbbc || sidMsSdwan || sidIcl || sidGeneric || '';
    if (!sid) warningsForThisTicket.push('SID tidak ditemukan');

    const siteRaw = extractField(block, 'SITE');
    const namaIndomarco = parseIndomarcoSite(siteRaw);
    if (!namaIndomarco) warningsForThisTicket.push('Field SITE kosong');

    const cpe = sanitizeStatus(extractField(block, 'Pengecekan\\s*CPE'));
    const spe = sanitizeStatus(extractField(block, 'Pengecekan\\s*SPE'));
    const upe = sanitizeStatus(extractField(block, 'Pengecekan\\s*UPE'));

    const rowCells = [
      sid,               // 1: SID
      namaIndomarco,     // 2: Nama Indomarco
      '',                // 3: kosong
      '',                // 4: status
      'aktif',           // 5: aktif
      '',                // 6: kosong
      '',                // 7: kosong
      cpe,               // 8: CPE
      spe,               // 9: SPE
      upe,               // 10: UPE
      '',                // 11: kosong
      ticketId,          // 12: ID Tiket
      shift,             // 13: Shift
      currentDate,       // 14: Tanggal
    ];

    try {
      tsvRows.push(buildRow(rowCells, ticketLabel));
      results.push({
        id: ticketLabel,
        sid,
        nama: namaIndomarco,
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
