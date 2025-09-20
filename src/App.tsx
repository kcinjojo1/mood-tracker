import { useEffect, useMemo, useRef, useState } from 'react'
import CategoryCard from './components/CategoryCard'
import PeriodSelector from './components/PeriodSelector'
import Summary from './components/Summary'
import ChartPanel from './components/ChartPanel'
import { CategoryMeta, Period, TapEvent } from './types'
import { getAll, clearAll, downloadJSON, saveAll } from './lib/storage'
import { countByColor, rangeFor } from './lib/analytics'

const CATEGORIES: CategoryMeta[] = [
  { key: 'wokeRested',  label: 'Woke up well rested' },
  { key: 'hasGoal',     label: 'Have a goal for the day' },
  { key: 'microTask',   label: 'Completed a micro task', hint: 'Tiny win to feel proud' },
  { key: 'happyNoon',   label: 'Feel happy at noon' },
  { key: 'threeGoals',  label: 'Achieved three goals today' },
  { key: 'goodMeal',    label: 'Had a good meal' },
  { key: 'bedRested',   label: 'Going to bed well rested' }
]

export default function App() {
  const [events, setEvents] = useState<TapEvent[]>([])
  const [period, setPeriod] = useState<Period>('day')
  const [now, setNow] = useState<Date>(new Date())
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEvents(getAll())
    const t = setInterval(() => setNow(new Date()), 60_000)
    // sync across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'mood-tracker-events-v1') setEvents(getAll())
    }
    window.addEventListener('storage', onStorage)
    return () => {
      clearInterval(t)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const { from, to } = useMemo(() => rangeFor(period, now), [period, now])
  const totals = useMemo(() => countByColor(events, from, to), [events, from, to])

  const onNewTap = () => setEvents(getAll())

  const resetConfirm = () => {
    if (typeof window !== 'undefined' && confirm('This will delete all your saved taps on this device. Continue?')) {
      clearAll()
      setEvents([])
    }
  }

  const importJSON = async (file: File) => {
    const text = await file.text()
    const parsed = JSON.parse(text) as TapEvent[]
    if (!Array.isArray(parsed)) throw new Error('Invalid JSON')
    saveAll(parsed)
    setEvents(parsed)
  }

  const handleImportClick = () => fileInputRef.current?.click()
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (file) importJSON(file).catch(() => alert('Invalid JSON file'))
    e.currentTarget.value = ''
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title">Mood Tracker</div>
        <div className="toolbar">
          <PeriodSelector period={period} setPeriod={setPeriod} />
          <button className="select" onClick={() => downloadJSON()} title="Export all data as JSON">Export</button>
          <button className="select" onClick={handleImportClick} title="Import data from a JSON file">Import</button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} style={{ display: 'none' }} />
          <button className="select" onClick={resetConfirm} title="Delete all data on this device">Reset</button>
        </div>
      </header>

      <section className="grid" aria-label="Mood categories">
        {CATEGORIES.map(meta => (
          <CategoryCard key={meta.key} meta={meta} onTap={onNewTap} />
        ))}
      </section>

      <div style={{ height: 12 }} />

      <Summary
        red={totals.red}
        green={totals.green}
        title={period.charAt(0).toUpperCase() + period.slice(1)}
      />

      <div style={{ height: 12 }} />

      <ChartPanel events={events} period={period} />

      <p className="footer">
        Data is stored locally on your device (no login required). Export/Import lets you back up or move your data.
      </p>
    </div>
  )
}
