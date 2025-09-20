import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from 'chart.js'
import { byDayBuckets } from '../lib/analytics'
import { TapEvent } from '../types'

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip)

type Props = {
  events: TapEvent[]
  period: 'day' | 'week' | 'month'
}

export default function ChartPanel({ events, period }: Props) {
  const daysBack = period === 'day' ? 7 : period === 'week' ? 28 : 90
  const buckets = byDayBuckets(events, daysBack)
  const data = {
    labels: buckets.map(b => b.label),
    datasets: [
      { label: 'Green', data: buckets.map(b => b.green) },
      { label: 'Red', data: buckets.map(b => b.red) }
    ]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { maxRotation: 0 } },
      y: { beginAtZero: true }
    },
    plugins: { legend: { position: 'top' as const } }
  }

  return (
    <div className="card" style={{ height: 260 }}>
      <Bar data={data} options={options} />
    </div>
  )
}
