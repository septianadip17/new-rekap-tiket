import { splitTicketBlocks, extractField, sanitizeStatus } from "./parserUtils";
import { getIndonesianDate } from "../utils/dateUtils";
import { buildRow } from "../utils/validation";

export function parseIndomarcoSite(siteRaw) {
  if (!siteRaw) return '';
  const parts = siteRaw.split('-');
  if (parts.length >= 2) {
    const region = parts[0].trim().toLowerCase();
    const regionTitle = region.charAt(0).toUpperCase() + region.slice(1);
    const siteCode = parts[1].trim().toUpperCase();
    
    // Gunakan operator + dengan spasi agar tidak ada bug kurung literal
    return "Indomarco " + regionTitle + " " + siteCode;
  }
  return "Indomarco " + siteRaw.trim();
}

export function parseIndomarcoTickets(rawText, shift = "siang") {
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
    const ticketId = extractField(block, "ID\\s*TIKET") || "";
    const ticketLabel = ticketId
      ? `Tiket \({ticketId}`
      : `Tiket #\){ticketNum}`;

    if (!ticketId) {
      warningsForThisTicket.push("ID TIKET kosong");
    }

    // 2. SID (Prioritas IBBC, fallback IPVPN)
    const sidIbbc = extractField(block, "SID\\s*IBBC");
    const sidIcl = extractField(block, "SID\\s*ICL");
    const sidMsSdwan = extractField(block, "SID\\s*MS SDWAN");
    const sidGeneric = extractField(block, "SID");
    const sid = sidIbbc || sidMsSdwan || sidIcl || sidGeneric || "";

    if (!sid) {
      warningsForThisTicket.push("SID tidak ditemukan");
    }

    // 3. SITE -> Indomarco [Region] [Kode]
    const siteRaw = extractField(block, "SITE");
    const namaIndomarco = parseIndomarcoSite(siteRaw);
    if (!namaIndomarco) {
      warningsForThisTicket.push("Field SITE kosong");
    }

    // 4. Pengecekan
    const cpe = sanitizeStatus(extractField(block, "Pengecekan\\s*CPE"));
    const spe = sanitizeStatus(extractField(block, "Pengecekan\\s*SPE"));
    const upe = sanitizeStatus(extractField(block, "Pengecekan\\s*UPE"));

    // Struktur 14 Kolom INDOMARCO
    const rowCells = [
      sid, // 1: SID
      namaIndomarco, // 2: Nama Indomarco
      "", // 3: kosong
      "", // 4: status
      "aktif", // 5: aktif
      "", // 6: kosong
      "", // 7: kosong
      cpe, // 8: CPE
      spe, // 9: SPE
      upe, // 10: UPE
      "", // 11: kosong
      ticketId, // 12: ID Tiket
      shift, // 13: Shift
      currentDate, // 14: Tanggal
    ];

    try {
      const tsvLine = buildRow(rowCells, ticketLabel);
      tsvRows.push(tsvLine);

      results.push({
        id: ticketLabel,
        sid,
        nama: namaIndomarco,
        ticketId,
        cpe,
        spe,
        upe,
        shift,
        date: currentDate,
        status: warningsForThisTicket.length > 0 ? "WARNING" : "SUCCESS",
        warnings: warningsForThisTicket,
      });
    } catch (err) {
      errors.push(`\({ticketLabel}:\){err.message}`);
    }

    if (warningsForThisTicket.length > 0) {
      warnings.push({
        ticket: ticketLabel,
        messages: warningsForThisTicket,
      });
    }
  });

  return {
    rawOutput: tsvRows.join("\n"),
    results,
    summary: {
      total: blocks.length,
      success: results.filter((r) => r.status === "SUCCESS").length,
      warning: warnings.length,
      error: errors.length,
    },
    warnings,
    errors,
  };
}
