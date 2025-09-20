import { Period } from '../types'

type Props = {
  period: Period
  setPeriod: (p: Period) => void
}

export default function PeriodSelector({ period, setPeriod }: Props) {
  const options: Period[] = ['day', 'week', 'month']
  return (
    <div className="toolbar">
      {options.map(p => (
        <button
          key={p}
          className={`chip ${period === p ? 'active' : ''}`}
          onClick={() => setPeriod(p)}
          aria-pressed={period === p}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  )
}
