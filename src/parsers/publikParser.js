import { splitTicketBlocks, extractField, sanitizeStatus } from './parserUtils';
import { getIndonesianDate } from '../utils/dateUtils';
import { buildRow } from '../utils/validation';

/**
 * Merapikan nama pelanggan tanpa mengubah case atau kata aslinya.
 */
export function cleanCustomerName(rawName) {
  if (!rawName) return '';
  // Cukup bersihkan tab liar dan rapikan spasi berlebih
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

    // 1. ID Tiket
    const ticketId = extractField(block, 'ID\\s*TIKET') || '';
    const ticketLabel = ticketId ? `Tiket ${ticketId}` : `Tiket #${ticketNum}`;

    if (!ticketId) {
      warningsForThisTicket.push('ID TIKET kosong');
    }

    // 2. SID
    const sid = extractField(block, 'SID(?:\\s*IBBC|\\s*IPVPN)?') || '';
    if (!sid) {
      warningsForThisTicket.push('SID tidak ditemukan');
    }

    // 3. Nama Pelanggan (sesuai input mentah)
    const customerRaw =
      extractField(block, 'NAMA\\s*PELANGGAN') ||
      extractField(block, 'PELANGGAN') ||
      '';
    const customerName = cleanCustomerName(customerRaw);
    if (!customerName) {
      warningsForThisTicket.push('NAMA PELANGGAN kosong');
    }

    // 4. Pengecekan status
    const cpe = sanitizeStatus(extractField(block, 'Pengecekan\\s*CPE'));
    const spe = sanitizeStatus(extractField(block, 'Pengecekan\\s*SPE'));
    const upe = sanitizeStatus(extractField(block, 'Pengecekan\\s*UPE'));

    // Struktur 14 Kolom PUBLIK
    const rowCells = [
      sid,                              // Col 1: SID
      customerName,                     // Col 2: Nama Pelanggan
      'Termonitor perangkat down',      // Col 3: Status
      '',                               // Col 4
      '',                               // Col 5
      '',                               // Col 6
      '',                               // Col 7
      cpe,                              // Col 8: CPE
      spe,                              // Col 9: SPE
      upe,                              // Col 10: UPE
      '',                               // Col 11
      ticketId,                         // Col 12: ID Tiket
      shift,                            // Col 13: Shift
      currentDate                       // Col 14: Tanggal
    ];

    try {
      const tsvLine = buildRow(rowCells, ticketLabel);
      tsvRows.push(tsvLine);

      results.push({
        id: ticketLabel,
        sid,
        nama: customerName,
        ticketId,
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
      success: results.filter((r) => r.status === 'SUCCESS').length,
      warning: warnings.length,
      error: errors.length
    },
    warnings,
    errors
  };
}