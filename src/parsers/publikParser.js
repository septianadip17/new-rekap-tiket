import { splitTicketBlocks, extractField } from './parserUtils';
import { getIndonesianDate } from '../utils/dateUtils';
import { buildRow } from '../utils/validation';

/**
 * Membersihkan nama customer publik:
 * - Hapus prefix regional (JKT-, JATIM-, SBS-, JABAR-, dll.)
 * - Hapus suffix perangkat (-RB2011-CPE-01, -RB951-CPE-01, dll.)
 * - Ganti '_' dan '.' dengan spasi
 * - Title Case & normalisasi spasi
 */
export function cleanCustomerName(rawName) {
  if (!rawName) return '';

  let name = rawName.trim();

  // 1. Hilangkan prefix regional di awal (misal: JKT-, JATIM-, SBS-, JABAR-, SUMUT-, dll.)
  name = name.replace(/^[A-Z0-9]+-(?=[A-Za-z])/i, '');

  // 2. Hilangkan suffix perangkat/router umum di akhir
  // Contoh: -RB2011-CPE-01, -RB951-CPE-01, -RB1100..., -CPE-01, -CCR1009..., dll.
  name = name.replace(/-(?:RB\w+|CCR\w+|CPE[-\w]*|ROUTER|SW|SWITCH)[-\w]*$/i, '');
  name = name.replace(/-CPE-\d+$/i, '');

  // 3. Ubah separator '.' dan '_' menjadi spasi
  name = name.replace(/[._]+/g, ' ');

  // 4. Perbaiki multiple spaces
  name = name.replace(/\s+/g, ' ').trim();

  // 5. Title Case yang rapi (khusus singkatan penting bisa tetap atau disesuaikan)
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      // Biarkan singkatan umum bila diinginkan atau kapitalisasi huruf pertama
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

    const ticketId = extractField(block, 'ID\\s*TIKET') || '';
    const ticketLabel = ticketId ? `Tiket ${ticketId}` : `Tiket #${ticketNum}`;

    // SID
    const sidIbbc = extractField(block, 'SID\\s*IBBC');
    const sidIpvpn = extractField(block, 'SID\\s*IPVPN');
    const sidGeneric = extractField(block, 'SID');
    
    let sid = sidIbbc || sidIpvpn || sidGeneric || '';
    if (!sid) {
      warningsForThisTicket.push('SID tidak ditemukan');
    }

    // Nama Pelanggan
    const customerRaw = extractField(block, 'NAMA\\s*PELANGGAN') || extractField(block, 'PELANGGAN') || '';
    let customerClean = '';
    if (customerRaw) {
      customerClean = cleanCustomerName(customerRaw);
    } else {
      warningsForThisTicket.push('NAMA PELANGGAN tidak ditemukan');
    }

    if (!ticketId) warningsForThisTicket.push('ID TIKET tidak ditemukan');

    // Konstruksi 14 Kolom PUBLIK:
    // Kolom 1 = SID
    // Kolom 2 = Nama Pelanggan Bersih
    // Kolom 3 = Termonitor perangkat down
    // Kolom 4..11 = Kosong
    // Kolom 12 = ID Tiket
    // Kolom 13 = Shift
    // Kolom 14 = Tanggal
    const rowCells = [
      sid,                              // Col 1
      customerClean,                    // Col 2
      'Termonitor perangkat down',      // Col 3
      '',                               // Col 4
      '',                               // Col 5
      '',                               // Col 6
      '',                               // Col 7
      '',                               // Col 8
      '',                               // Col 9
      '',                               // Col 10
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
      success: results.filter(r => r.status === 'SUCCESS').length,
      warning: warnings.length,
      error: errors.length
    },
    warnings,
    errors
  };
}