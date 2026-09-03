/**
 * Normalisasi teks: ganti non-breaking space (\u00A0) menjadi spasi biasa.
 */
export function normalizeText(text) {
  if (!text) return "";
  return text.replace(/\u00A0/g, " ");
}

/**
 * Membersihkan nilai status (UP/DOWN/normal dsb).
 * Mengabaikan tanda strip atau string null agar kolom tetap kosong bersih.
 */
export function sanitizeStatus(val) {
  if (!val) return "";
  const trimmed = val.trim();
  if (trimmed === "-" || trimmed === "--" || trimmed.toLowerCase() === "null") {
    return "";
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

  // Pemicu awal tiket baru
  const ticketStartRegex =
    /^(?:\d+\.\s*$|INFORMASI\s*:|Berikut kami sampaikan|TIKET\s*\d+)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (ticketStartRegex.test(trimmed) && currentBlock.length > 0) {
      const blockStr = currentBlock.join("\n");
      // Pastikan blok sebelumnya memang memuat data tiket sebelum dipotong
      if (
        /SITE\s*:|SID/i.test(blockStr) ||
        /NAMA\s*PELANGGAN/i.test(blockStr)
      ) {
        blocks.push(blockStr);
        currentBlock = [];
      }
    }
    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    const lastBlockStr = currentBlock.join("\n");
    if (
      /SITE\s*:|SID/i.test(lastBlockStr) ||
      /NAMA\s*PELANGGAN/i.test(lastBlockStr)
    ) {
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
    "i",
  );
  const match = cleanBlock.match(regex);
  if (!match) return null;

  let val = match[1].replace(/[\t\r\n]+/g, " ").trim();
  return val.length > 0 ? val : null;
}
