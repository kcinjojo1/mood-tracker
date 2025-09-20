import { useEffect, useMemo, useState } from 'react'
import CategoryCard from 'src/components/CategoryCard.tsx'
import PeriodSelector from 'src/components/PeriodSelector.tsx'
import Summary from 'src/components/Summary.tsx'
import ChartPanel from 'src/components/ChartPanel.tsx'
import { CategoryMeta, Period, TapEvent } from './types'
import { getAll, clearAll } from './lib/storage'
import { countByColor, rangeFor } from './lib/analytics'

const CATEGORIES: CategoryMeta[] = [
  { key:'wokeRested', label:'Woke up well rested' },
  { key:'hasGoal', label:'Have a goal for the day' },
  { key:'microTask', label:'Completed a micro task' , hint:'Tiny win to feel proud' },
  { key:'happyNoon', label:'Feel happy at noon' },
  { key:'threeGoals', label:'Achieved three goals today' },
  { key:'goodMeal', label:'Had a good meal' },
  { key:'bedRested', label:'Going to bed well rested' },
]

export default function App(){
  const [events, setEvents] = useState<TapEvent[]>([])
  const [period, setPeriod] = useState<Period>('day')
  const [now, setNow] = useState<Date>(new Date()) // for re-computing summaries as day changes

  useEffect(()=>{
    setEvents(getAll())
    const t = setInterval(()=>setNow(new Date()), 60_000)
    return ()=>clearInterval(t)
  },[])

  const { from, to } = useMemo(()=>rangeFor(period, now), [period, now])
  const totals = useMemo(()=>countByColor(events, from, to), [events, from, to])

  const onNewTap = () => {
    // refresh from storage for integrity (in case of other tabs)
    setEvents(getAll())
  }

  const resetConfirm = () => {
    if (confirm('This will delete all your saved taps on this device. Continue?')) {
      clearAll()
      setEvents([])
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title">Mood Tracker</div>
        <div className="toolbar">
          <PeriodSelector period={period} setPeriod={setPeriod} />
          <button className="select" onClick={resetConfirm} title="Delete all data on this device">Reset</button>
        </div>
      </header>

      <section className="grid" aria-label="Mood categories">
        {CATEGORIES.map(meta => (
          <CategoryCard key={meta.key} meta={meta} onTap={onNewTap} />
        ))}
      </section>

      <div style={{height:12}} />

<Summary
  red={totals.red}
  green={totals.green}
  title={period.charAt(0).toUpperCase() + period.slice(1)}
/>      <div style={{height:12}} />

      <ChartPanel events={events} period={period} />

      <p className="footer">
        Data is stored locally on your device (no login required). Add to Home Screen for quick access.
      </p>
    </div>
  )
}
