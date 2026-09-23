/**
 * Normalisasi teks: ganti non-breaking space (\u00A0) menjadi spasi biasa.
 */
export function normalizeText(text) {
  if (!text) return '';
  return text.replace(/\u00A0/g, ' ');
}

/**
 * Membersihkan nilai status (UP/DOWN/normal dsb).
 * Mengabaikan tanda strip atau string null agar kolom tetap kosong bersih.
 */
export function sanitizeStatus(val) {
  if (!val) return '';
  const trimmed = val.trim();
  if (trimmed === '-' || trimmed === '--' || trimmed.toLowerCase() === 'null') {
    return '';
  }
  return trimmed;
}

/**
 * Memisahkan teks mentah menjadi blok tiket terpisah.
 * Pemicu tiket baru:
 * - Nomor urut seperti "500." atau "1211."
 * - "INFORMASI :"
 * - "Berikut kami sampaikan"
 * - "TIKET X"
 */
export function splitTicketBlocks(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const cleanText = normalizeText(rawText);
  const lines = cleanText.split(/\r?\n/);
  const blocks = [];
  let currentBlock = [];

  const TICKET_START = /^(?:\d+\.\s*$|INFORMASI\s*:|Berikut kami sampaikan|TIKET\s*\d+)/i;
  const HAS_DATA = /SITE\s*:|SID|NAMA\s*PELANGGAN/i;

  for (const line of lines) {
    const trimmed = line.trim();

    if (TICKET_START.test(trimmed) && currentBlock.length > 0) {
      const blockStr = currentBlock.join('\n');
      // Pastikan blok sebelumnya memang memuat data tiket sebelum dipotong
      if (HAS_DATA.test(blockStr)) {
        blocks.push(blockStr);
        currentBlock = [];
      }
    }
    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    const lastBlockStr = currentBlock.join('\n');
    if (HAS_DATA.test(lastBlockStr)) {
      blocks.push(lastBlockStr);
    }
  }

  return blocks;
}

/**
 * Mengambil value dari key secara fleksibel.
 * Membersihkan sisa carriage return dan tab internal agar tidak merusak sel Excel.
 */
export function extractField(block, keyPattern) {
  const cleanBlock = normalizeText(block);
  const regex = new RegExp(
    `(?:^|\\r?\\n)[ \\t]*${keyPattern}[ \\t]*:[ \\t]*(.*)`,
    'i',
  );
  const match = cleanBlock.match(regex);
  if (!match) return null;

  const val = match[1].replace(/[\t\r\n]+/g, ' ').trim();
  return val.length > 0 ? val : null;
}

/**
 * Membuat label tiket konsisten, fallback ke nomor urut bila ID kosong.
 */
export function buildTicketLabel(ticketId, ticketNum) {
  return ticketId ? `Tiket ${ticketId}` : `Tiket #${ticketNum}`;
}

/**
 * Merangkai hasil parse standar (summary, warnings, errors) untuk semua mode.
 */
export function buildParseResult({ tsvRows, results, warnings, errors, total }) {
  return {
    rawOutput: tsvRows.join('\n'),
    results,
    summary: {
      total,
      success: results.filter((r) => r.status === 'SUCCESS').length,
      warning: warnings.length,
      error: errors.length,
    },
    warnings,
    errors,
  };
}
