import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HawkinsMeter from '../components/HawkinsMeter'
import { getLevelForScore } from '../hawkins'
import type { Neologism } from '../types'
import { exportAnalysisToPdf } from '../utils/exportPdf'
import { downloadShareCard } from '../utils/shareCard'

type Tab = 'roots' | 'remedy' | 'wisdom'

export default function Analysis() {
  const { currentAnalysis, saveWord, savedWords } = useApp()
  const [tab, setTab] = useState<Tab>('roots')
  const [copiedMantra, setCopiedMantra] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)

  function handleDownload() {
    if (!currentAnalysis) return
    setDownloading(true)
    setTimeout(() => {
      exportAnalysisToPdf(currentAnalysis)
      setDownloading(false)
    }, 100)
  }

  function handleShare() {
    if (!currentAnalysis) return
    setSharing(true)
    setTimeout(() => {
      downloadShareCard(currentAnalysis)
      setSharing(false)
    }, 100)
  }

  if (!currentAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="text-5xl">🌿</div>
        <div className="font-display text-2xl text-parchment">No analysis yet</div>
        <p className="text-parchment-muted text-sm">Complete a check-in to see your analysis.</p>
        <Link to="/checkin" className="btn-primary">Begin Check-In</Link>
      </div>
    )
  }

  const a = currentAnalysis
  const level = getLevelForScore(a.hawkinsLevel)
  const isSaved = (word: string) => savedWords.some(w => w.word === word)

  function handleSaveWord(neo: Neologism) {
    saveWord({
      word: neo.word,
      definition: neo.definition,
      mantra: a.mantra,
      sourceEmotion: a.dominantEmotion,
      hawkinsLevel: a.hawkinsLevel,
      tone: neo.tone,
    })
  }

  async function copyMantra() {
    await navigator.clipboard.writeText(a.mantra)
    setCopiedMantra(true)
    setTimeout(() => setCopiedMantra(false), 2000)
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'roots', label: 'Roots', icon: '🌱' },
    { id: 'remedy', label: 'Remedy', icon: '✦' },
    { id: 'wisdom', label: 'Wisdom', icon: '📜' },
  ]

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-parchment-muted uppercase tracking-widest mb-1">
            {new Date(a.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="font-display text-3xl text-parchment capitalize">{a.dominantEmotion}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-amber-dim/40 text-amber-glow hover:bg-amber-dim/10 active:scale-95 transition-all duration-150 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {downloading ? 'Opening...' : 'Download PDF'}
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-root-border text-parchment-muted hover:text-parchment hover:border-root-muted active:scale-95 transition-all duration-150 disabled:opacity-50"
            title="Download share card (PNG)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {sharing ? 'Generating...' : 'Share'}
          </button>
          <Link to="/checkin" className="btn-ghost text-sm py-2 px-4">
            New ✦
          </Link>
        </div>
      </div>

      {/* Hawkins level card */}
      <div className="glass-card p-5 space-y-4 amber-glow">
        <HawkinsMeter level={a.hawkinsLevel} range={a.hawkinsRange} size="md" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-root-surface rounded-xl p-3">
            <div className="text-parchment-muted text-xs mb-0.5">God view</div>
            <div className="text-parchment font-medium">{level.godView}</div>
          </div>
          <div className="bg-root-surface rounded-xl p-3">
            <div className="text-parchment-muted text-xs mb-0.5">Life view</div>
            <div className="text-parchment font-medium">{level.lifeView}</div>
          </div>
        </div>
      </div>

      {/* Root insight */}
      <div className="glass-card p-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <div className="text-xs uppercase tracking-widest text-parchment-muted">Root Insight</div>
        </div>
        <p className="text-parchment-dim text-sm leading-relaxed">{a.rootInsight}</p>
      </div>

      {/* Mantra */}
      <div className="glass-card p-5 text-center space-y-3 border-amber-dim/20 amber-glow">
        <div className="text-xs uppercase tracking-widest text-parchment-muted">Your Mantra</div>
        <div className="font-display text-xl text-amber-glow italic leading-relaxed">"{a.mantra}"</div>
        <button
          onClick={copyMantra}
          className="text-xs text-parchment-muted hover:text-parchment transition-colors flex items-center gap-1 mx-auto"
        >
          {copiedMantra ? '✓ Copied!' : '⎘ Copy mantra'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-root-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              tab === t.id
                ? 'bg-amber-dim/20 text-amber-glow border-b-2 border-amber-glow'
                : 'text-parchment-muted hover:text-parchment hover:bg-root-surface/50'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Roots — Etymology */}
      {tab === 'roots' && (
        <div className="space-y-4 animate-slide-up">
          {a.etymology.map((e, i) => (
            <div key={i} className="glass-card p-5 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-xl text-amber-glow">{e.word}</h3>
                <span className="text-xs text-parchment-muted border border-root-border px-2 py-0.5 rounded-full shrink-0">
                  {e.language}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-root-surface rounded-xl p-3">
                  <div className="text-parchment-muted text-xs mb-1">Root</div>
                  <div className="text-parchment font-medium italic">{e.root}</div>
                </div>
                <div className="bg-root-surface rounded-xl p-3">
                  <div className="text-parchment-muted text-xs mb-1">Originally meant</div>
                  <div className="text-parchment font-medium">{e.originalMeaning}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-parchment-muted uppercase tracking-wider">Insight</div>
                <p className="text-parchment-dim text-sm leading-relaxed">{e.insight}</p>
              </div>

              {e.wordShadow && (
                <div className="border-t border-root-border pt-3 space-y-1">
                  <div className="text-xs text-parchment-muted uppercase tracking-wider flex items-center gap-1.5">
                    <span>🌑</span> Word Shadow
                  </div>
                  <p className="text-parchment-muted text-xs leading-relaxed italic">{e.wordShadow}</p>
                </div>
              )}
            </div>
          ))}

          {/* Reframe */}
          <div className="glass-card p-5 space-y-2 border-forest/30"
            style={{ borderColor: 'rgba(45,90,78,0.4)' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <div className="text-xs uppercase tracking-widest text-parchment-muted">Reframe</div>
            </div>
            <p className="text-parchment-dim text-sm leading-relaxed">{a.reframe}</p>
          </div>
        </div>
      )}

      {/* Tab: Remedy — Neologisms */}
      {tab === 'remedy' && (
        <div className="space-y-4 animate-slide-up">
          <p className="text-sm text-parchment-muted italic">
            New words to install as mental software — speak them, write them, make them yours.
          </p>
          {a.neologisms.map((neo, i) => (
            <div key={i} className="glass-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-amber-glow">{neo.word}</h3>
                  <div className="flex gap-2 mt-1.5">
                    <span className={`tag-${neo.tone}`}>{neo.tone}</span>
                    <span className="tag bg-root-surface text-parchment-muted border border-root-border">
                      {neo.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSaveWord(neo)}
                  disabled={isSaved(neo.word)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSaved(neo.word)
                      ? 'border-green-700/40 text-green-400 bg-green-900/20 cursor-default'
                      : 'border-amber-dim/40 text-amber-glow hover:bg-amber-dim/10'
                  }`}
                >
                  {isSaved(neo.word) ? '✓ Saved' : '+ Lexicon'}
                </button>
              </div>
              <p className="text-parchment-dim text-sm leading-relaxed">{neo.definition}</p>
            </div>
          ))}

          {/* Mantra */}
          <div className="glass-card p-5 text-center space-y-3 border-amber-dim/20">
            <div className="text-xs uppercase tracking-widest text-parchment-muted">Spoken Mantra</div>
            <div className="font-display text-xl text-amber-glow italic">"{a.mantra}"</div>
            <p className="text-xs text-parchment-muted">
              Say this aloud 3× — morning, midday, and before sleep.
            </p>
            <button
              onClick={copyMantra}
              className="btn-ghost text-xs py-1.5 px-4"
            >
              {copiedMantra ? '✓ Copied!' : '⎘ Copy mantra'}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Wisdom */}
      {tab === 'wisdom' && (
        <div className="space-y-4 animate-slide-up">
          {/* Myth */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛</span>
              <div>
                <div className="text-xs text-parchment-muted uppercase tracking-wider">Mythological Mirror</div>
                <h3 className="font-display text-base text-parchment">{a.wisdom.myth.title}</h3>
              </div>
            </div>
            <p className="text-parchment-dim text-sm leading-relaxed">{a.wisdom.myth.story}</p>
            <div className="border-t border-root-border pt-3">
              <div className="text-xs text-amber-glow uppercase tracking-wider mb-1">Your parallel</div>
              <p className="text-parchment-muted text-sm italic">{a.wisdom.myth.parallel}</p>
            </div>
          </div>

          {/* Fable */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦊</span>
              <div>
                <div className="text-xs text-parchment-muted uppercase tracking-wider">Fable</div>
                <h3 className="font-display text-base text-parchment">{a.wisdom.fable.title}</h3>
              </div>
            </div>
            <p className="text-parchment-dim text-sm leading-relaxed">{a.wisdom.fable.lesson}</p>
          </div>

          {/* Philosophy */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔭</span>
              <div>
                <div className="text-xs text-parchment-muted uppercase tracking-wider">Philosophy</div>
                <h3 className="font-display text-base text-parchment">{a.wisdom.philosophy.source}</h3>
              </div>
            </div>
            <blockquote className="border-l-2 border-amber-dim pl-4 text-parchment-dim text-sm italic leading-relaxed">
              "{a.wisdom.philosophy.quote}"
            </blockquote>
            <p className="text-parchment-muted text-sm">{a.wisdom.philosophy.application}</p>
          </div>

          {/* Stoic */}
          <div className="glass-card p-5 space-y-2 bg-root-surface/50">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <div className="text-xs text-parchment-muted uppercase tracking-wider">Stoic Micro-Lesson</div>
            </div>
            <p className="text-parchment-dim text-sm leading-relaxed">{a.wisdom.stoic}</p>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex gap-3 pt-2 pb-6">
        <Link to="/checkin" className="btn-primary flex-1 text-center text-sm">
          New Check-In
        </Link>
        <Link to="/lexicon" className="btn-ghost flex-1 text-center text-sm">
          My Lexicon
        </Link>
      </div>
    </div>
  )
}
