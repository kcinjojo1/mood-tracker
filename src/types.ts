export type CategoryKey =
  | 'wokeRested'
  | 'hasGoal'
  | 'microTask'
  | 'happyNoon'
  | 'threeGoals'
  | 'goodMeal'
  | 'bedRested'

export type TapValue = 'red' | 'green'

export interface TapEvent {
  id: string        // uuid
  ts: number        // unix ms
  category: CategoryKey
  value: TapValue
}

export interface CategoryMeta {
  key: CategoryKey
  label: string
  hint?: string
}

export type Period = 'day' | 'week' | 'month'
