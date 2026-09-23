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
 * Merapikan nama pelanggan tanpa mengubah case atau kata aslinya.
 */
export function cleanCustomerName(rawName) {
  if (!rawName) return '';
  return rawName.replace(/[\t\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parsePublikTickets(rawText, shift = 'siang') {
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

    const sid = extractField(block, 'SID(?:\\s*IBBC|\\s*IPVPN)?') || '';
    if (!sid) warningsForThisTicket.push('SID tidak ditemukan');

    const customerRaw =
      extractField(block, 'NAMA\\s*PELANGGAN') ||
      extractField(block, 'PELANGGAN') ||
      '';
    const customerName = cleanCustomerName(customerRaw);
    if (!customerName) warningsForThisTicket.push('NAMA PELANGGAN kosong');

    const cpe = sanitizeStatus(extractField(block, 'Pengecekan\\s*CPE'));
    const spe = sanitizeStatus(extractField(block, 'Pengecekan\\s*SPE'));
    const upe = sanitizeStatus(extractField(block, 'Pengecekan\\s*UPE'));

    const rowCells = [
      sid,                          // 1: SID
      customerName,                 // 2: Nama Pelanggan
      'Termonitor perangkat down',  // 3: Status
      '',                           // 4: kosong
      'aktif',                      // 5: aktif
      '',                           // 6: kosong
      '',                           // 7: kosong
      cpe,                          // 8: CPE
      spe,                          // 9: SPE
      upe,                          // 10: UPE
      '',                           // 11: kosong
      ticketId,                     // 12: ID Tiket
      shift,                        // 13: Shift
      currentDate,                  // 14: Tanggal
    ];

    try {
      tsvRows.push(buildRow(rowCells, ticketLabel));
      results.push({
        id: ticketLabel,
        sid,
        nama: customerName,
        ticketId,
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
