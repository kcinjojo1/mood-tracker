import { Period } from '../types'

type Props = {
  period: Period
  setPeriod: (p: Period)=>void
}

export default function PeriodSelector({ period, setPeriod }: Props){
  return (
    <div className="toolbar">
      {(['day','week','month'] as Period[]).map(p => (
        <button
          key={p}
          className={`chip ${period===p ? 'active' : ''}`}
          onClick={()=>setPeriod(p)}
          aria-pressed={period===p}
        >
          {p[0].toUpperCase()+p.slice(1)}
        </button>
      ))}
    </div>
  )
}
