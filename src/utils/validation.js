export const TOTAL_COLUMNS = 14;

export function validateRow(row, ticketIdentifier = "Unknown") {
  if (!Array.isArray(row)) {
    throw new Error(`[Row Invalid] Data bukan Array pada ${ticketIdentifier}`);
  }
  if (row.length !== TOTAL_COLUMNS) {
    throw new Error(
      `[Kolom Tidak Valid] ${ticketIdentifier} menghasilkan ${row.length} kolom (Harus tepat ${TOTAL_COLUMNS} kolom).`
    );
  }
  return true;
}

export function buildRow(cells, ticketIdentifier = "Unknown") {
  validateRow(cells, ticketIdentifier);
  // Bersihkan setiap cell dari tab atau newline tersembunyi
  const sanitizedCells = cells.map((cell) =>
    String(cell ?? '')
      .replace(/[\t\r\n]+/g, ' ')
      .trim()
  );
  return sanitizedCells.join('\t');
}