// Parses an iOS/macOS CallHistory.storedata (SQLite) file in the browser.
// Uses sql.js (WASM) loaded lazily — only imported when the user picks a file.
// WASM binary is fetched from the sql.js CDN; the file itself never leaves the device.

const APPLE_EPOCH_OFFSET_MS = 978307200000 // ms between Unix epoch and Apple Core Data epoch (2001-01-01)

let _SQL = null
async function getSQL() {
  if (_SQL) return _SQL
  const initSqlJs = (await import('sql.js')).default
  _SQL = await initSqlJs({
    // Fetch the WASM binary from the official CDN rather than bundling it (~1.5 MB)
    locateFile: f => `https://sql.js.org/dist/${f}`,
  })
  return _SQL
}

export async function parseCallHistory(file, year) {
  const SQL = await getSQL()
  const buf = await file.arrayBuffer()
  const db = new SQL.Database(new Uint8Array(buf))

  // Discover which columns exist (schema varies by iOS/macOS version)
  const colRows = db.exec('PRAGMA table_info(ZCALLRECORD)')[0]
  if (!colRows) throw new Error('Not a valid CallHistory.storedata file.')
  const cols = new Set(colRows.values.map(r => r[1]))

  // Determine how to filter for FaceTime calls
  let ftFilter = ''
  if (cols.has('ZSERVICE_PROVIDER')) {
    ftFilter = "AND ZSERVICE_PROVIDER = 'com.apple.facetime'"
  } else if (cols.has('ZCALLTYPE')) {
    // 8 = FaceTime audio, 16 = FaceTime video (common in older schemas)
    ftFilter = 'AND ZCALLTYPE IN (8, 16)'
  }
  // If neither column exists we fall back to all answered calls with duration > 0

  const nameSel = cols.has('ZNAME') ? 'ZNAME' : 'NULL'
  const locSel  = cols.has('ZLOCATIONIDENTIFIER') ? 'ZLOCATIONIDENTIFIER' : 'NULL'

  const result = db.exec(`
    SELECT ZDATE, ZDURATION, ZADDRESS, ${nameSel}, ZANSWERED, ${locSel}
    FROM ZCALLRECORD
    WHERE ZANSWERED = 1 AND ZDURATION > 0
    ${ftFilter}
  `)

  db.close()

  if (!result[0]) return []

  return result[0].values
    .map(([date, duration, address, name, answered, location]) => ({
      date: new Date(date * 1000 + APPLE_EPOCH_OFFSET_MS),
      duration: Math.floor(duration ?? 0),
      address: address ?? '',
      name: name ?? null,
      answered: Boolean(answered),
      location: location ?? null,
    }))
    .filter(r => r.date.getFullYear() === year)
}
