/**
 * Normalisasi teks: ganti non-breaking space (\u00A0) menjadi spasi biasa.
 */
export function normalizeText(text) {
  if (!text) return '';
  return text.replace(/\u00A0/g, ' ');
}

/**
 * Memisahkan teks mentah menjadi blok tiket.
 * Penanda awal tiket murni:
 * - Nomor urut seperti "1211."
 * - "INFORMASI :"
 * - "Berikut kami sampaikan" (untuk tiket PUBLIK)
 * - "TIKET X"
 */
export function splitTicketBlocks(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const cleanText = normalizeText(rawText);
  const lines = cleanText.split(/\r?\n/);
  const blocks = [];
  let currentBlock = [];

  // Pemicu tiket baru HANYA di awal blok (bukan di tengah seperti ID TIKET)
  const ticketStartRegex = /^(?:\d+\.\s*$|INFORMASI\s*:|Berikut kami sampaikan|TIKET\s*\d+)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (ticketStartRegex.test(trimmed) && currentBlock.length > 0) {
      // Pastikan blok sebelumnya memiliki data penting sebelum dipotong
      const blockStr = currentBlock.join('\n');
      if (/SITE\s*:|SID/i.test(blockStr) || /NAMA\s*PELANGGAN/i.test(blockStr)) {
        blocks.push(blockStr);
        currentBlock = [];
      }
    }
    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    const lastBlockStr = currentBlock.join('\n');
    // Validasi blok terakhir bukan sekadar teks sampah atau header tanggal
    if (/SITE\s*:|SID/i.test(lastBlockStr) || /NAMA\s*PELANGGAN/i.test(lastBlockStr)) {
      blocks.push(lastBlockStr);
    }
  }

  return blocks;
}

/**
 * Mengambil value dari key secara fleksibel dan aman dari karakter rusak.
 */
export function extractField(block, keyPattern) {
  const cleanBlock = normalizeText(block);
  const regex = new RegExp(`(?:^|\\r?\\n)[ \\t]*${keyPattern}[ \\t]*:[ \\t]*(.*)`, 'i');
  const match = cleanBlock.match(regex);
  if (!match) return null;

  let val = match[1].replace(/[\t\r\n]+/g, ' ').trim();
  return val.length > 0 ? val : null;
}