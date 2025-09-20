// src/types.ts

// All the categories you defined in App.tsx
export type CategoryKey =
  | 'wokeRested'
  | 'hasGoal'
  | 'microTask'
  | 'happyNoon'
  | 'threeGoals'
  | 'goodMeal'
  | 'bedRested'

// Each log entry when someone taps a red/green button
export interface TapEvent {
  id: string         // unique id for the tap
  ts: number         // timestamp in ms
  category: CategoryKey
  value: 'red' | 'green'
}

// Meta information for rendering the categories
export interface CategoryMeta {
  key: CategoryKey
  label: string
  hint?: string
}

// Period options for your summaries
export type Period = 'day' | 'week' | 'month'
