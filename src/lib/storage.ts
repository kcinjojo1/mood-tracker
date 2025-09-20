import { TapEvent } from '../types'

const KEY = 'mood-tracker-events-v1'

// read all events
export function getAll(): TapEvent[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as TapEvent[]) : []
  } catch {
    return []
  }
}

// overwrite all
export function saveAll(events: TapEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(events))
}

// append one
export function append(event: TapEvent) {
  const all = getAll()
  all.push(event)
  saveAll(all)
}

// delete all
export function clearAll() {
  localStorage.removeItem(KEY)
}

// export as downloadable JSON blob
export function downloadJSON(filename = 'mood-tracker-export.json') {
  const data = JSON.stringify(getAll(), null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
