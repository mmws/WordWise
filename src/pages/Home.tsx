import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HawkinsMeter from '../components/HawkinsMeter'
import { getLevelForScore } from '../hawkins'
import { DEMO_ANALYSIS } from '../data/demoAnalysis'

export default function Home() {
  const navigate = useNavigate()
  const { analyses, savedWords, apiKey, setCurrentAnalysis } = useApp()

  function viewDemo() {
    setCurrentAnalysis(DEMO_ANALYSIS)
    navigate('/analysis')
  }
  const lastAnalysis = analyses[0]

  const recentLevels = analyses.slice(0, 7).map(a => a.hawkinsLevel)
  const avgLevel = recentLevels.length
    ? Math.round(recentLevels.reduce((a, b) => a + b, 0) / recentLevels.length)
    : null

  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero */}
      <div className="text-center pt-4 pb-2 space-y-3">
        <div className="text-5xl animate-float">🌳</div>
        <h1 className="font-display text-4xl md:text-5xl text-gradient">WordWise</h1>
        <p className="text-parchment-muted text-base max-w-md mx-auto leading-relaxed">
          Understand the roots of how you feel.<br />
          <em>Forge the words to become who you're meant to be.</em>
        </p>
      </div>

      {/* API Key warning */}
      {!apiKey && (
        <div className="glass-card p-4 border-amber-dim/30 rounded-xl flex items-start gap-3">
          <span className="text-2xl mt-0.5">📖</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-amber-glow text-sm">Lite mode active</div>
            <div className="text-parchment-muted text-xs mt-0.5">
              Check-ins work right now using WordWise's built-in etymology engine. Add your free
              Anthropic API key in Settings for deeper, AI-personalized analysis.
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Link to="/settings" className="btn-primary text-sm py-2 px-4 text-center">
              Add Key
            </Link>
            <button onClick={viewDemo} className="btn-ghost text-sm py-2 px-4">
              View AI Sample
            </button>
          </div>
        </div>
      )}

      {/* Primary CTA */}
      <div className="glass-card p-6 amber-glow rounded-2xl text-center space-y-4">
        <div className="text-parchment-muted text-sm tracking-wide uppercase">Today's Practice</div>
        <h2 className="font-display text-2xl text-parchment">What's alive in your world right now?</h2>
        <p className="text-parchment-muted text-sm">
          Describe what you're experiencing — a challenge, emotion, or moment. WordWise will reveal the roots and forge your remedy.
        </p>
        <Link to="/checkin" className="btn-primary inline-block text-base px-8 py-3">
          Begin Check-In ✦
        </Link>
      </div>

      {/* Stats row */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{analyses.length}</div>
            <div className="text-xs text-parchment-muted mt-1">Check-ins</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{savedWords.length}</div>
            <div className="text-xs text-parchment-muted mt-1">Saved words</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: avgLevel ? getLevelForScore(avgLevel).color : '#d4a24c' }}>
              {avgLevel ?? '—'}
            </div>
            <div className="text-xs text-parchment-muted mt-1">Avg. calibration</div>
          </div>
        </div>
      )}

      {/* Last analysis snapshot */}
      {lastAnalysis && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-parchment">Last Session</h3>
            <Link to="/analysis" className="text-xs text-amber-glow hover:underline">View full →</Link>
          </div>
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: getLevelForScore(lastAnalysis.hawkinsLevel).bgColor }}>
                {getLevelForScore(lastAnalysis.hawkinsLevel).emotion.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-parchment capitalize">{lastAnalysis.dominantEmotion}</div>
                <div className="text-xs text-parchment-muted truncate mt-0.5">"{lastAnalysis.userInput}"</div>
              </div>
              <div className="text-xs text-parchment-muted">
                {new Date(lastAnalysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <HawkinsMeter level={lastAnalysis.hawkinsLevel} size="sm" showLabel={false} />
            {lastAnalysis.mantra && (
              <div className="text-center py-2 px-4 rounded-xl bg-root-surface border border-root-border">
                <div className="text-xs text-parchment-muted mb-1">Your mantra</div>
                <div className="font-display text-amber-glow italic text-sm">"{lastAnalysis.mantra}"</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lexicon preview */}
      {savedWords.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-parchment">Your Lexicon</h3>
            <Link to="/lexicon" className="text-xs text-amber-glow hover:underline">See all →</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedWords.slice(0, 6).map(w => (
              <div key={w.id}
                className="px-3 py-1.5 rounded-full border border-amber-dim/30 bg-amber-dim/10 text-amber-glow text-sm font-medium">
                {w.word}
              </div>
            ))}
            {savedWords.length > 6 && (
              <div className="px-3 py-1.5 rounded-full border border-root-border text-parchment-muted text-sm">
                +{savedWords.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer tagline */}
      <div className="text-center text-xs text-parchment-muted/50 pb-4">
        Language is the software of the mind. Update your code.
      </div>
    </div>
  )
}
