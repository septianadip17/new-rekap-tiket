export const TOTAL_COLUMNS = 14;

/**
 * Memvalidasi apakah row tepat memiliki 14 kolom.
 * Melemparkan Error jika tidak valid agar tidak silently producing wrong output.
 */
export function validateRow(row, ticketIdentifier = "Unknown") {
  if (!Array.isArray(row)) {
    throw new Error(`[Row Invalid] Data baris bukan berupa Array pada tiket: ${ticketIdentifier}`);
  }
  if (row.length !== TOTAL_COLUMNS) {
    throw new Error(
      `[Kolom Tidak Valid] Tiket ${ticketIdentifier} menghasilkan ${row.length} kolom (Diharuskan tepat ${TOTAL_COLUMNS} kolom).`
    );
  }
  return true;
}

/**
 * Membangun baris TSV dengan validasi ketat.
 */
export function buildRow(cells, ticketIdentifier = "Unknown") {
  validateRow(cells, ticketIdentifier);
  return cells.join('\t');
}