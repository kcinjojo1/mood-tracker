type Props = {
  red: number
  green: number
  title: string
}

export default function Summary({ red, green, title }: Props) {
  const total = red + green
  const pctGreen = total ? Math.round((green / total) * 100) : 0

  return (
    <div className="summary">
      <div className="summaryItem">
        <div className="small">{title} Greens</div>
        <div className="kpi">{green}</div>
      </div>
      <div className="summaryItem">
        <div className="small">{title} Reds</div>
        <div className="kpi">{red}</div>
      </div>
      <div className="summaryItem">
        <div className="small">Green %</div>
        <div className="kpi">{pctGreen}%</div>
      </div>
    </div>
  )
}
