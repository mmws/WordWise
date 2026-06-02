export interface Etymology {
  word: string
  root: string
  language: string
  originalMeaning: string
  insight: string
  wordShadow: string
}

export interface Neologism {
  word: string
  definition: string
  type: 'portmanteau' | 'compound' | 'verb' | 'adjective'
  tone: 'warrior' | 'gentle' | 'playful' | 'mythic' | 'scientific'
}

export interface Wisdom {
  myth: { title: string; story: string; parallel: string }
  fable: { title: string; lesson: string }
  philosophy: { source: string; quote: string; application: string }
  stoic: string
}

export interface Analysis {
  id: string
  timestamp: number
  userInput: string
  dominantEmotion: string
  hawkinsLevel: number
  hawkinsName: string
  hawkinsRange: [number, number]
  etymology: Etymology[]
  neologisms: Neologism[]
  mantra: string
  wisdom: Wisdom
  rootInsight: string
  reframe: string
}

export interface SavedWord {
  id: string
  word: string
  definition: string
  mantra?: string
  savedAt: number
  sourceEmotion: string
  hawkinsLevel: number
  tone: string
}

export interface ProgressEntry {
  date: string
  level: number
  emotion: string
  label: string
}

export type AiTone = 'poetic' | 'direct' | 'warrior' | 'playful' | 'scientific'

export interface AppState {
  apiKey: string
  aiTone: AiTone
  analyses: Analysis[]
  savedWords: SavedWord[]
  currentAnalysis: Analysis | null
}
