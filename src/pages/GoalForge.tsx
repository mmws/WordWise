import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { forgeGoal, type GoalForgeResult } from '../services/claudeModes'
import { getLevelForScore } from '../hawkins'

const LOADING_MSGS = [
  'Excavating the roots of your goal...',
  'Identifying hidden assumptions...',
  'Alchemizing language...',
  'Forging your Power Declaration...',
  'Mapping the calibration path...',
]

const EXAMPLE_GOALS = [
  'I want to make more money',
  'I want to be healthier',
  'I want to find a relationship',
  'I want to start my own business',
  'I want to stop procrastinating',
]

export default function GoalForge() {
  const { apiKey, aiTone } = useApp()
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState<GoalForgeResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleForge() {
    if (!apiKey) { setError('Add your API key in Settings first.'); return }
    if (goal.trim().length < 5) { setError('Please enter your goal.'); return }
    setError('')
    setLoading(true)
    let idx = 0
    setLoadingMsg(LOADING_MSGS[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[idx])
    }, 2200)
    try {
      const r = await forgeGoal(goal.trim(), aiTone)
      setResult(r)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Goal forging failed')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  async function copyDeclaration() {
    if (!result) return
    await navigator.clipboard.writeText(result.powerDeclaration)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-20 h-20 rounded-full border border-amber-dim/30 flex items-center justify-center animate-pulse-glow">
          <span className="text-4xl animate-float">⚗️</span>
        </div>
        <div className="font-display text-xl text-parchment">{loadingMsg}</div>
        <div className="text-xs text-parchment-muted">10–20 seconds</div>
      </div>
    )
  }

  if (result) {
    const origLevel = getLevelForScore(result.originalLevel)

    return (
      <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-parchment-muted uppercase tracking-widest mb-1">Goal Forge</div>
            <h1 className="font-display text-2xl text-parchment">Your Power Declaration</h1>
          </div>
          <button onClick={() => setResult(null)} className="btn-ghost text-sm py-2 px-4 shrink-0">New</button>
        </div>

        {/* Original goal + level */}
        <div className="glass-card p-5 space-y-3">
          <div className="text-xs text-parchment-muted uppercase tracking-widest">Original Goal</div>
          <div className="text-parchment-dim italic text-sm">"{result.userGoal}"</div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold" style={{ color: origLevel.color }}>{result.originalLevel}</div>
            <div>
              <div className="text-sm font-medium" style={{ color: origLevel.color }}>{result.originalLevelName}</div>
              <div className="text-xs text-parchment-muted">As originally stated</div>
            </div>
          </div>
        </div>

        {/* Limiting assumptions */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2"><span>🔍</span><div className="text-xs text-parchment-muted uppercase tracking-wider">Hidden Assumptions in Your Language</div></div>
          <div className="space-y-2">
            {result.limitingAssumptions?.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-parchment-dim">
                <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Etymology */}
        {result.goalEtymology?.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-parchment-muted uppercase tracking-widest">Etymology of Your Goal Words</div>
            {result.goalEtymology.map((e, i) => (
              <div key={i} className="glass-card p-4 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-lg text-amber-glow">{e.word}</span>
                  <span className="text-xs text-parchment-muted">{e.root} — "{e.originalMeaning}"</span>
                </div>
                <p className="text-parchment-dim text-sm">{e.insight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Forged goal */}
        <div className="glass-card p-5 space-y-3 border-forest/40" style={{ borderColor: 'rgba(45,90,78,0.5)' }}>
          <div className="flex items-center gap-2"><span>🔥</span><div className="text-xs text-parchment-muted uppercase tracking-wider">Forged Goal</div></div>
          <p className="text-parchment font-medium text-base leading-relaxed">{result.forgedGoal}</p>
        </div>

        {/* Power Declaration */}
        <div className="glass-card p-6 space-y-4 amber-glow border-amber-dim/30">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-parchment-muted mb-3">Power Declaration</div>
            <div className="font-display text-lg text-amber-glow leading-relaxed italic">
              {result.powerDeclaration}
            </div>
          </div>
          <div className="text-center">
            <button onClick={copyDeclaration} className="text-xs text-parchment-muted hover:text-parchment flex items-center gap-1 mx-auto">
              {copied ? '✓ Copied!' : '⎘ Copy Declaration'}
            </button>
          </div>
        </div>

        {/* Mantra */}
        <div className="glass-card p-4 text-center space-y-2">
          <div className="text-xs uppercase tracking-widest text-parchment-muted">Mantra</div>
          <div className="font-display text-xl text-amber-glow italic">"{result.mantra}"</div>
        </div>

        {/* Neologisms */}
        {result.neologisms?.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-parchment-muted uppercase tracking-widest">Your Goal Lexicon</div>
            {result.neologisms.map((n, i) => (
              <div key={i} className="glass-card p-4 space-y-1">
                <div className="font-display text-xl text-amber-glow">{n.word}</div>
                <p className="text-parchment-dim text-sm">{n.definition}</p>
              </div>
            ))}
          </div>
        )}

        {/* Calibration path */}
        {result.calibrationPath?.length > 0 && (
          <div className="glass-card p-5 space-y-4">
            <div className="text-xs text-parchment-muted uppercase tracking-widest">Calibration Path</div>
            <div className="space-y-3">
              {result.calibrationPath.map((step, i) => {
                const lvl = getLevelForScore(step.level)
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: lvl.bgColor, color: lvl.color }}>
                        {i + 1}
                      </div>
                      {i < result.calibrationPath.length - 1 && (
                        <div className="w-px h-6 mt-1" style={{ background: lvl.color + '40' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: lvl.color }}>{step.levelName}</span>
                        <span className="text-xs text-parchment-muted">Level {step.level}</span>
                      </div>
                      <p className="text-parchment-dim text-sm leading-relaxed">{step.milestone}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action anchors */}
        {result.actionAnchors?.length > 0 && (
          <div className="glass-card p-5 space-y-3 bg-root-surface/50">
            <div className="flex items-center gap-2"><span>👣</span><div className="text-xs text-parchment-muted uppercase tracking-wider">Action Anchors — This Week</div></div>
            <div className="space-y-2">
              {result.actionAnchors.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-parchment">
                  <span className="text-amber-glow mt-0.5 shrink-0">✦</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pb-6">
          <button onClick={() => setResult(null)} className="btn-primary flex-1 text-sm">Forge Another</button>
          <Link to="/checkin" className="btn-ghost flex-1 text-center text-sm">Check-In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2 pt-2">
        <div className="text-4xl">⚗️</div>
        <h1 className="font-display text-3xl text-parchment">Goal Forge</h1>
        <p className="text-parchment-muted text-sm max-w-sm mx-auto">
          Enter a vague or low-energy goal. WordWise excavates its roots, exposes hidden assumptions, and alchemizes it into a high-calibration Power Declaration.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="font-display text-lg text-amber-glow">Enter your goal</h2>
        <textarea
          className="input-field min-h-[100px]"
          placeholder="e.g. I want to make more money / I want to be healthier / I want to stop procrastinating..."
          value={goal}
          onChange={e => setGoal(e.target.value)}
          maxLength={500}
        />
        <div className="text-xs text-parchment-muted">Even vague is fine — that's the point.</div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <div className="text-xs text-parchment-muted uppercase tracking-widest">Try an example</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_GOALS.map(eg => (
            <button key={eg} onClick={() => setGoal(eg)}
              className="px-3 py-1.5 rounded-full text-xs border border-root-border text-parchment-muted hover:border-amber-dim hover:text-parchment-dim transition-all">
              {eg}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">{error}</div>}

      <button onClick={handleForge} className="btn-primary w-full text-base">
        Forge My Goal ⚗️
      </button>
    </div>
  )
}
