import { splitTicketBlocks, extractField } from './parserUtils';
import { getIndonesianDate } from '../utils/dateUtils';
import { buildRow } from '../utils/validation';

export function cleanCustomerName(rawName) {
  if (!rawName) return '';

  let name = rawName.trim();

  // Hapus prefix regional di awal (misal: JKT-, JATIM-, SBS-, dll.)
  name = name.replace(/^[A-Z0-9]+-(?=[A-Za-z])/i, '');

  // Hapus suffix router/CPE (misal: -RB2011-CPE-01, -RB951, dll.)
  name = name.replace(/-(?:RB\w+|CCR\w+|CPE[-\w]*|ROUTER|SW|SWITCH)[-\w]*$/i, '');
  name = name.replace(/-CPE-\d+$/i, '');

  // Ganti pemisah dot/underscore jadi spasi
  name = name.replace(/[._]+/g, ' ');
  name = name.replace(/\s+/g, ' ').trim();

  return name
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
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

    // ID Tiket
    const ticketId = extractField(block, 'ID\\s*TIKET') || '';
    const ticketLabel = ticketId ? `Tiket ${ticketId}` : `Tiket #${ticketNum}`;

    if (!ticketId) {
      warningsForThisTicket.push('ID TIKET kosong');
    }

    // SID
    const sid = extractField(block, 'SID(?:\\s*IBBC|\\s*IPVPN)?') || '';
    if (!sid) {
      warningsForThisTicket.push('SID tidak ditemukan');
    }

    // Nama Pelanggan
    const customerRaw = extractField(block, 'NAMA\\s*PELANGGAN') || extractField(block, 'PELANGGAN') || '';
    const customerClean = cleanCustomerName(customerRaw);
    if (!customerClean) {
      warningsForThisTicket.push('NAMA PELANGGAN kosong');
    }

    // Pengecekan bila ada (opsional, tanpa warning)
    const cpe = extractField(block, 'Pengecekan\\s*CPE') || '';
    const spe = extractField(block, 'Pengecekan\\s*SPE') || '';
    const upe = extractField(block, 'Pengecekan\\s*UPE') || '';

    // Struktur 14 Kolom PUBLIK
    const rowCells = [
      sid,                              // 1: SID
      customerClean,                    // 2: Nama Pelanggan Bersih
      'Termonitor perangkat down',      // 3: Status
      '',                               // 4
      '',                               // 5
      '',                               // 6
      '',                               // 7
      cpe,                              // 8: CPE
      spe,                              // 9: SPE
      upe,                              // 10: UPE
      '',                               // 11
      ticketId,                         // 12: ID Tiket
      shift,                            // 13: Shift
      currentDate                       // 14: Tanggal
    ];

    try {
      const tsvLine = buildRow(rowCells, ticketLabel);
      tsvRows.push(tsvLine);

      results.push({
        id: ticketLabel,
        sid,
        nama: customerClean,
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