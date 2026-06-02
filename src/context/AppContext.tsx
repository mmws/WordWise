import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Analysis, SavedWord, AppState, AiTone } from '../types'
import { loadApiKey } from '../services/claude'

interface AppContextValue extends AppState {
  setApiKey: (key: string) => void
  setAiTone: (tone: AiTone) => void
  addAnalysis: (analysis: Analysis) => void
  setCurrentAnalysis: (analysis: Analysis | null) => void
  saveWord: (word: Omit<SavedWord, 'id' | 'savedAt'>) => void
  removeWord: (id: string) => void
  clearHistory: () => void
}

type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_AI_TONE'; payload: AiTone }
  | { type: 'ADD_ANALYSIS'; payload: Analysis }
  | { type: 'SET_CURRENT'; payload: Analysis | null }
  | { type: 'SAVE_WORD'; payload: SavedWord }
  | { type: 'REMOVE_WORD'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'HYDRATE'; payload: Partial<AppState> }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload }
    case 'SET_AI_TONE':
      return { ...state, aiTone: action.payload }
    case 'ADD_ANALYSIS':
      return { ...state, analyses: [action.payload, ...state.analyses].slice(0, 100) }
    case 'SET_CURRENT':
      return { ...state, currentAnalysis: action.payload }
    case 'SAVE_WORD':
      if (state.savedWords.some(w => w.word === action.payload.word)) return state
      return { ...state, savedWords: [action.payload, ...state.savedWords] }
    case 'REMOVE_WORD':
      return { ...state, savedWords: state.savedWords.filter(w => w.id !== action.payload) }
    case 'CLEAR_HISTORY':
      return { ...state, analyses: [] }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const initialState: AppState = {
  apiKey: '',
  aiTone: 'poetic',
  analyses: [],
  savedWords: [],
  currentAnalysis: null,
}

const AppContext = createContext<AppContextValue | null>(null)
const STORAGE_KEY = 'wordwise_state'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
      const apiKey = loadApiKey()
      if (apiKey) dispatch({ type: 'SET_API_KEY', payload: apiKey })
    } catch (e) {
      console.warn('Failed to load persisted state', e)
    }
  }, [])

  useEffect(() => {
    const toSave = {
      analyses: state.analyses,
      savedWords: state.savedWords,
      aiTone: state.aiTone,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state.analyses, state.savedWords, state.aiTone])

  const value: AppContextValue = {
    ...state,
    setApiKey: (key) => {
      dispatch({ type: 'SET_API_KEY', payload: key })
      localStorage.setItem('wordwise_api_key', key)
    },
    setAiTone: (tone) => dispatch({ type: 'SET_AI_TONE', payload: tone }),
    addAnalysis: (analysis) => dispatch({ type: 'ADD_ANALYSIS', payload: analysis }),
    setCurrentAnalysis: (a) => dispatch({ type: 'SET_CURRENT', payload: a }),
    saveWord: (w) => dispatch({
      type: 'SAVE_WORD',
      payload: { ...w, id: crypto.randomUUID(), savedAt: Date.now() }
    }),
    removeWord: (id) => dispatch({ type: 'REMOVE_WORD', payload: id }),
    clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
