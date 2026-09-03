/**
 * Memisahkan teks mentah menjadi blok-blok tiket terpisah.
 * Mendeteksi delimitasi berdasarkan marker umum seperti INFORMASI, TIKET, SITE, atau double-newline.
 */
export function splitTicketBlocks(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split(/\r?\n/);
  const blocks = [];
  let currentBlock = [];

  const startPattern = /^(?:TIKET\s*\d+|INFORMASI\s*:|SITE\s*:|ID\s*TIKET\s*:)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Deteksi awal blok tiket baru
    if (startPattern.test(trimmed) && currentBlock.length > 0) {
      // Cek apakah blok sebelumnya sudah memiliki isi signifikan (lebih dari 2 baris)
      const nonBlankLines = currentBlock.filter(l => l.trim().length > 0);
      if (nonBlankLines.length >= 2) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
    }
    currentBlock.push(line);
  }

  if (currentBlock.length > 0 && currentBlock.some(l => l.trim().length > 0)) {
    blocks.push(currentBlock.join('\n'));
  }

  return blocks;
}

/**
 * Mencari nilai dari suatu key secara case-insensitive & toleran terhadap spasi.
 */
export function extractField(block, keyPattern) {
  // Regex: key (toleran spasi) : [spasi] (isi sampai akhir baris)
  const regex = new RegExp(`(?:^|\\r?\\n)[ \\t]*${keyPattern}[ \\t]*:[ \\t]*(.*)`, 'i');
  const match = block.match(regex);
  return match ? match[1].trim() : null;
}