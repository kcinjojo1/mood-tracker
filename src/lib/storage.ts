import { TapEvent } from '../types'

const KEY = 'mood-tracker-events-v1';

export function getAll(): TapEvent[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TapEvent[]) : [];
  } catch {
    return [];
  }
}

export function saveAll(events: TapEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function append(event: TapEvent) {
  const all = getAll();
  all.push(event);
  saveAll(all);
}

export function clearAll() {
  localStorage.removeItem(KEY);
}
