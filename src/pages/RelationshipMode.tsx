import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { analyzeRelationship, type RelationshipAnalysis } from '../services/claudeModes'
import { getLevelForScore } from '../hawkins'

const LOADING_MSGS = [
  'Mapping the relational field...',
  'Reading between the words...',
  'Tracing the calibration gap...',
  'Consulting Hanlon\'s Razor...',
  'Forging your repair lexicon...',
]

export default function RelationshipMode() {
  const { apiKey, aiTone } = useApp()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState<RelationshipAnalysis | null>(null)
  const [error, setError] = useState('')
  const [copiedMantra, setCopiedMantra] = useState(false)

  async function handleAnalyze() {
    if (!apiKey) { setError('Add your API key in Settings first.'); return }
    if (text.trim().length < 20) { setError('Please describe the situation in a bit more detail.'); return }
    setError('')
    setLoading(true)
    let idx = 0
    setLoadingMsg(LOADING_MSGS[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[idx])
    }, 2000)
    try {
      const r = await analyzeRelationship(text.trim(), aiTone)
      setResult(r)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  async function copyMantra(mantra: string) {
    await navigator.clipboard.writeText(mantra)
    setCopiedMantra(true)
    setTimeout(() => setCopiedMantra(false), 2000)
  }

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-20 h-20 rounded-full border border-amber-dim/30 flex items-center justify-center animate-pulse-glow">
          <span className="text-4xl animate-float">💞</span>
        </div>
        <div className="font-display text-xl text-parchment">{loadingMsg}</div>
        <div className="text-xs text-parchment-muted">10–20 seconds</div>
      </div>
    )
  }

  if (result) {
    const selfLevel = getLevelForScore(result.selfLevel)
    const otherLevel = getLevelForScore(result.otherLevel)
    const gap = Math.abs(result.selfLevel - result.otherLevel)

    return (
      <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-parchment-muted uppercase tracking-widest mb-1">Relationship Analysis</div>
            <h1 className="font-display text-2xl text-parchment">{result.situation}</h1>
          </div>
          <button onClick={() => setResult(null)} className="btn-ghost text-sm py-2 px-4 shrink-0">New</button>
        </div>

        {/* Calibration comparison */}
        <div className="glass-card p-5 space-y-4">
          <div className="text-xs text-parchment-muted uppercase tracking-widest">Calibration Map</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl border" style={{ borderColor: selfLevel.color + '40', background: selfLevel.bgColor }}>
              <div className="text-xs text-parchment-muted mb-1">You</div>
              <div className="text-3xl font-bold" style={{ color: selfLevel.color }}>{result.selfLevel}</div>
              <div className="font-display text-base mt-1" style={{ color: selfLevel.color }}>{result.selfLevelName}</div>
            </div>
            <div className="text-center p-4 rounded-xl border" style={{ borderColor: otherLevel.color + '40', background: otherLevel.bgColor }}>
              <div className="text-xs text-parchment-muted mb-1">Other</div>
              <div className="text-3xl font-bold" style={{ color: otherLevel.color }}>{result.otherLevel}</div>
              <div className="font-display text-base mt-1" style={{ color: otherLevel.color }}>{result.otherLevelName}</div>
            </div>
          </div>
          <div className="text-center text-xs text-parchment-muted">
            Calibration gap: <span className="text-parchment font-medium">{gap} points</span>
            {gap > 100 && <span className="text-amber-glow ml-1">— significant distance</span>}
          </div>
        </div>

        {/* Dynamic insight */}
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center gap-2"><span>🔍</span><div className="text-xs text-parchment-muted uppercase tracking-wider">Dynamic Insight</div></div>
          <p className="text-parchment-dim text-sm leading-relaxed">{result.dynamicInsight}</p>
        </div>

        {/* Hanlon's Razor */}
        <div className="glass-card p-5 space-y-2 border-forest/30" style={{ borderColor: 'rgba(45,90,78,0.4)' }}>
          <div className="flex items-center gap-2"><span>🔪</span><div className="text-xs text-parchment-muted uppercase tracking-wider">Hanlon's Razor</div></div>
          <p className="text-parchment-dim text-sm leading-relaxed">{result.hanlonsRazor}</p>
        </div>

        {/* Root words */}
        {result.selfRootWords?.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-parchment-muted uppercase tracking-widest">Your Word Roots</div>
            {result.selfRootWords.map((w, i) => (
              <div key={i} className="glass-card p-4 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-lg text-amber-glow">{w.word}</span>
                  <span className="text-xs text-parchment-muted italic">{w.root}</span>
                </div>
                <p className="text-parchment-dim text-sm">{w.insight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Repair Mantra */}
        <div className="glass-card p-5 text-center space-y-3 border-amber-dim/20 amber-glow">
          <div className="text-xs uppercase tracking-widest text-parchment-muted">Repair Mantra</div>
          <div className="font-display text-xl text-amber-glow italic">"{result.repairMantra}"</div>
          <button onClick={() => copyMantra(result.repairMantra)}
            className="text-xs text-parchment-muted hover:text-parchment flex items-center gap-1 mx-auto">
            {copiedMantra ? '✓ Copied!' : '⎘ Copy'}
          </button>
        </div>

        {/* Neologisms */}
        <div className="space-y-3">
          <div className="text-xs text-parchment-muted uppercase tracking-widest">Relational Neologisms</div>
          {result.neologisms?.map((n, i) => (
            <div key={i} className="glass-card p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl text-amber-glow">{n.word}</span>
                <span className={`tag-${n.tone}`}>{n.tone}</span>
              </div>
              <p className="text-parchment-dim text-sm">{n.definition}</p>
            </div>
          ))}
        </div>

        {/* Repair Lexicon */}
        {result.repairLexicon?.length > 0 && (
          <div className="glass-card p-5 space-y-3">
            <div className="text-xs text-parchment-muted uppercase tracking-widest">Repair Lexicon — Things to Say</div>
            <div className="space-y-2">
              {result.repairLexicon.map((phrase, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-parchment-dim">
                  <span className="text-amber-dim mt-0.5 shrink-0">✦</span>
                  <span className="italic">"{phrase}"</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wisdom */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2"><span>🔭</span>
            <div>
              <div className="text-xs text-parchment-muted uppercase tracking-wider">Wisdom</div>
              <div className="font-display text-sm text-parchment">{result.wisdom?.source}</div>
            </div>
          </div>
          <blockquote className="border-l-2 border-amber-dim pl-4 text-parchment-dim text-sm italic leading-relaxed">
            "{result.wisdom?.quote}"
          </blockquote>
          <p className="text-parchment-muted text-sm">{result.wisdom?.application}</p>
        </div>

        {/* Next Step */}
        <div className="glass-card p-5 space-y-2 bg-root-surface/50">
          <div className="flex items-center gap-2"><span>👣</span><div className="text-xs text-parchment-muted uppercase tracking-wider">Next Step (24 hours)</div></div>
          <p className="text-parchment text-sm font-medium leading-relaxed">{result.nextStep}</p>
        </div>

        <div className="flex gap-3 pb-6">
          <button onClick={() => setResult(null)} className="btn-primary flex-1 text-center text-sm">New Analysis</button>
          <Link to="/checkin" className="btn-ghost flex-1 text-center text-sm">Standard Check-In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2 pt-2">
        <div className="text-4xl">💞</div>
        <h1 className="font-display text-3xl text-parchment">Relationship Mode</h1>
        <p className="text-parchment-muted text-sm max-w-sm mx-auto">
          Describe a conflict, dynamic, or relationship pattern. WordWise maps both parties' calibration levels and forges a repair lexicon.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="font-display text-lg text-amber-glow">Describe the situation</h2>
        <textarea
          className="input-field min-h-[160px]"
          placeholder="Describe the conflict, dynamic, or pattern you're navigating. Include what was said, how it felt, what you're struggling with. The more specific, the deeper the insight..."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={2000}
        />
        <div className="flex justify-between text-xs text-parchment-muted">
          <span>Be specific — name the words used, the feelings evoked</span>
          <span>{text.length}/2000</span>
        </div>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">{error}</div>}

      <button onClick={handleAnalyze} className="btn-primary w-full text-base">
        Map the Dynamic ✦
      </button>

      <div className="text-xs text-parchment-muted/50 text-center italic">
        Note: This tool offers linguistic and calibration perspective — not therapy or legal advice.
      </div>
    </div>
  )
}
