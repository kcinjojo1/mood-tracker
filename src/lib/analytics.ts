import { TapEvent, Period } from '../types'

export function startOfDay(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfWeek(d = new Date()): Date {
  // ISO week starting Monday
  const day = d.getDay() || 7; // 1..7
  const monday = new Date(d);
  monday.setHours(0,0,0,0);
  monday.setDate(d.getDate() - (day - 1));
  return monday;
}

export function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function rangeFor(period: Period, at = new Date()): { from: number; to: number } {
  const to = new Date(at); to.setHours(23,59,59,999);
  let fromDate: Date;
  if (period === 'day') fromDate = startOfDay(at);
  else if (period === 'week') fromDate = startOfWeek(at);
  else fromDate = startOfMonth(at);
  return { from: fromDate.getTime(), to: to.getTime() };
}

export function countByColor(events: TapEvent[], from: number, to: number) {
  let red = 0, green = 0;
  for (const e of events) {
    if (e.ts < from || e.ts > to) continue;
    if (e.value === 'red') red++;
    else green++;
  }
  return { red, green };
}

export function byDayBuckets(events: TapEvent[], daysBack: number) {
  // returns array oldest→newest of { dayLabel, red, green }
  const out: { label: string; red: number; green: number }[] = [];
  const today = startOfDay(new Date());
  for (let i = daysBack - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const from = day.getTime();
    const to = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999).getTime();
    const { red, green } = countByColor(events, from, to);
    out.push({ label: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), red, green });
  }
  return out;
}
