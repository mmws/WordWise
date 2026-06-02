import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getLevelForScore } from '../hawkins'
import { exportLexiconToPdf } from '../utils/exportLexiconPdf'

type Filter = 'all' | 'warrior' | 'gentle' | 'playful' | 'mythic' | 'scientific'

export default function Lexicon() {
  const { savedWords, removeWord } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [exporting, setExporting] = useState(false)

  function handleExport() {
    setExporting(true)
    setTimeout(() => {
      exportLexiconToPdf(savedWords)
      setExporting(false)
    }, 100)
  }
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const tones: Filter[] = ['all', 'warrior', 'gentle', 'playful', 'mythic', 'scientific']

  const filtered = filter === 'all'
    ? savedWords
    : savedWords.filter(w => w.tone === filter)

  async function copyWord(id: string, word: string, definition: string) {
    await navigator.clipboard.writeText(`${word} — ${definition}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (savedWords.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="text-5xl">📖</div>
        <div className="font-display text-2xl text-parchment">Your Lexicon is Empty</div>
        <p className="text-parchment-muted text-sm max-w-xs">
          Complete a check-in and save neologisms to build your personal Power Lexicon.
        </p>
        <Link to="/checkin" className="btn-primary">Begin Check-In</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-parchment">Lexicon of Power</h1>
          <p className="text-parchment-muted text-sm mt-1">{savedWords.length} word{savedWords.length !== 1 ? 's' : ''} forged</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-amber-dim/40 text-amber-glow hover:bg-amber-dim/10 active:scale-95 transition-all duration-150 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {exporting ? 'Opening...' : 'Export PDF'}
          </button>
          <div className="text-4xl">📖</div>
        </div>
      </div>

      {/* Tone filter */}
      <div className="flex gap-2 flex-wrap">
        {tones.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
              filter === t
                ? 'border-amber-glow bg-amber-dim/20 text-amber-glow'
                : 'border-root-border text-parchment-muted hover:border-root-muted hover:text-parchment-dim'
            }`}
          >
            {t === 'all' ? `All (${savedWords.length})` : t}
          </button>
        ))}
      </div>

      {/* Word grid */}
      <div className="grid gap-4">
        {filtered.map(word => {
          const level = getLevelForScore(word.hawkinsLevel)
          return (
            <div key={word.id} className="glass-card p-5 space-y-3 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-2xl text-amber-glow">{word.word}</h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`tag-${word.tone} capitalize`}>{word.tone}</span>
                    <span className="text-xs text-parchment-muted">
                      Born from <em className="text-parchment-dim">{word.sourceEmotion}</em>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyWord(word.id, word.word, word.definition)}
                    className="p-1.5 rounded-lg hover:bg-root-muted transition-colors text-parchment-muted hover:text-parchment"
                    title="Copy"
                  >
                    {copiedId === word.id ? '✓' : '⎘'}
                  </button>
                  {confirmDelete === word.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { removeWord(word.id); setConfirmDelete(null) }}
                        className="px-2 py-1 rounded text-xs bg-red-900/40 text-red-400 border border-red-800/40"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 rounded text-xs text-parchment-muted border border-root-border"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(word.id)}
                      className="p-1.5 rounded-lg hover:bg-root-muted transition-colors text-parchment-muted hover:text-red-400"
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <p className="text-parchment-dim text-sm leading-relaxed">{word.definition}</p>

              {word.mantra && (
                <div className="bg-root-surface rounded-xl px-4 py-2.5 border border-root-border">
                  <div className="text-xs text-parchment-muted mb-1">Mantra</div>
                  <div className="font-display text-sm text-amber-glow italic">"{word.mantra}"</div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-parchment-muted/60">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: level.color }} />
                  <span>Level {word.hawkinsLevel} · {level.name}</span>
                </div>
                <span>{new Date(word.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-parchment-muted">
          No {filter} words saved yet.
        </div>
      )}
    </div>
  )
}
