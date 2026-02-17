import fs from "fs";

export interface CsvParseOptions {
  delimiter?: string;
  trim?: boolean;
}

function detectDelimiter(text: string): string {
  let inQuotes = false;
  let firstRecord = "";

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      firstRecord += char;
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      break;
    }
    firstRecord += char;
  }

  const commaCount = (firstRecord.match(/,/g) || []).length;
  const semicolonCount = (firstRecord.match(/;/g) || []).length;
  const tabCount = (firstRecord.match(/\t/g) || []).length;

  if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
  if (semicolonCount > commaCount) return ";";
  return ",";
}

export function parseCsvText(
  text: string,
  options: CsvParseOptions = {}
): string[][] {
  const delimiter = options.delimiter || detectDelimiter(text);
  const trim = options.trim !== false;

  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(trim ? value.trim() : value);
      value = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }

      row.push(trim ? value.trim() : value);
      const hasContent = row.some((cell) => cell.length > 0);
      if (hasContent) {
        rows.push(row);
      }

      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(trim ? value.trim() : value);
  const hasContent = row.some((cell) => cell.length > 0);
  if (hasContent) {
    rows.push(row);
  }

  return rows;
}

export function parseCsvRecords(
  text: string,
  options: CsvParseOptions = {}
): Array<Record<string, string>> {
  const rows = parseCsvText(text, options);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header, idx) => {
    const safeHeader = header.trim();
    return safeHeader.length > 0 ? safeHeader : `column_${idx}`;
  });

  return rows.slice(1).map((row) => {
    const out: Record<string, string> = {};
    headers.forEach((header, idx) => {
      out[header] = row[idx] || "";
    });
    return out;
  });
}

export function parseCsvFile(
  filePath: string,
  options: CsvParseOptions = {}
): Array<Record<string, string>> {
  const raw = fs.readFileSync(filePath, "utf8");
  return parseCsvRecords(raw, options);
}
