// Minimal RFC 4180 parser: handles quoted cells, escaped quotes, CRLF and a BOM.
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else {
      cell += c;
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((x) => x.trim() !== ""));
}

const PHONE_LIKE = /^[+-]?[0-9][0-9 ()-]*$/;

// Cells starting with = + - @ can run as formulas when opened in Excel
// (CSV injection), so those are prefixed with an apostrophe. Phone numbers are left alone.
function safeCell(value: string): string {
  const risky =
    /^[=@\t\r]/.test(value) || (/^[+-]/.test(value) && !PHONE_LIKE.test(value));
  const s = risky ? `'${value}` : value;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map(safeCell).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  // The BOM makes Excel read the file as UTF-8.
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}