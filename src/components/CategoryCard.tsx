import { CategoryMeta, TapEvent } from '../types'
import { append } from '../lib/storage'

function uuid() {
  // simple uid good enough for local use
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
}

type Props = {
  meta: CategoryMeta
  onTap?: (e: TapEvent)=>void
}

export default function CategoryCard({ meta, onTap }: Props){
  const handle = (value: 'red' | 'green') => {
    const evt: TapEvent = {
      id: uuid(),
      ts: Date.now(),
      category: meta.key,
      value
    }
    append(evt)
    onTap?.(evt)
    // subtle haptic on supported devices
    if (window.navigator.vibrate) window.navigator.vibrate(8)
  }

  return (
    <div className="card">
      <div className="row">
        <div style={{flex:1}}>
          <div className="category">{meta.label}</div>
          {meta.hint && <div className="help">{meta.hint}</div>}
        </div>
        <div className="btns" aria-label={`${meta.label} controls`}>
          <button className="btn red" onClick={()=>handle('red')} aria-label="Red (No)">
            Red
          </button>
          <button className="btn green" onClick={()=>handle('green')} aria-label="Green (Yes)">
            Green
          </button>
        </div>
      </div>
    </div>
  )
}
