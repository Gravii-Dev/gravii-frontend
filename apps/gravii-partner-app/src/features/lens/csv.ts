export interface LensCsvParseResult {
  addresses: string[]
  duplicatesRemoved: number
  skippedRows: number
}

function normalizeCell(value: string) {
  return value.trim().replace(/^"+|"+$/g, "")
}

export function parseLensAddressesCsv(input: string): LensCsvParseResult {
  const rows = input
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)

  if (rows.length === 0) {
    return {
      addresses: [],
      duplicatesRemoved: 0,
      skippedRows: 0,
    }
  }

  const firstRowCells = rows[0].split(',').map(normalizeCell)
  const hasHeader =
    firstRowCells.length > 0 &&
    firstRowCells[0].toLowerCase() === 'address'

  const contentRows = hasHeader ? rows.slice(1) : rows
  const seen = new Set<string>()
  const addresses: string[] = []
  let skippedRows = 0
  let duplicatesRemoved = 0

  for (const row of contentRows) {
    const [firstCell] = row.split(',')
    const normalized = normalizeCell(firstCell ?? '').toLowerCase()

    if (!normalized) {
      skippedRows += 1
      continue
    }

    if (seen.has(normalized)) {
      duplicatesRemoved += 1
      continue
    }

    seen.add(normalized)
    addresses.push(normalized)
  }

  return {
    addresses,
    duplicatesRemoved,
    skippedRows,
  }
}
