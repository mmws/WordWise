import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { analyzeWithClaude } from '../services/claude'
import { generateLiteAnalysis } from '../services/liteAnalysis'
import { HAWKINS_LEVELS, getLevelForScore, CALIBRATION_EMOTIONS } from '../hawkins'
import { DEMO_ANALYSIS } from '../data/demoAnalysis'

const PROMPTS = [
  "What's alive in your world right now?",
  "What's the biggest challenge you're navigating today?",
  "Describe the dominant feeling in your body right now.",
  "What word or phrase keeps surfacing in your thoughts?",
  "What situation has you most activated right now?",
]

type Step = 'input' | 'calibrate' | 'loading'

export default function CheckIn() {
  const navigate = useNavigate()
  const { apiKey, aiTone, addAnalysis, setCurrentAnalysis } = useApp()

  function viewDemo() {
    setCurrentAnalysis(DEMO_ANALYSIS)
    navigate('/analysis')
  }
  const [step, setStep] = useState<Step>('input')
  const [text, setText] = useState('')
  const [sliderValue, setSliderValue] = useState(200)
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const [promptIdx] = useState(Math.floor(Math.random() * PROMPTS.length))
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')

  const currentLevel = getLevelForScore(sliderValue)

  const loadingMessages = [
    'Tracing the roots of your words...',
    'Consulting the etymology archives...',
    'Mapping your calibration...',
    'Forging your neologisms...',
    'Weaving in mythic wisdom...',
    'Composing your mantra...',
  ]

  async function handleAnalyze() {
    if (!text.trim() || text.trim().length < 10) {
      setError('Please share a bit more — at least a sentence or two.')
      return
    }
    setError('')
    setStep('loading')

    // No API key: run the local "Lite" engine instead of calling Claude.
    if (!apiKey) {
      setLoadingMsg('Consulting the local etymology archives...')
      // Brief pause so the loading state is perceptible and feels intentional.
      await new Promise(r => setTimeout(r, 700))
      const analysis = generateLiteAnalysis(text.trim(), sliderValue, aiTone, selectedEmotion)
      addAnalysis(analysis)
      setCurrentAnalysis(analysis)
      navigate('/analysis')
      return
    }

    let msgIdx = 0
    setLoadingMsg(loadingMessages[0])
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length
      setLoadingMsg(loadingMessages[msgIdx])
    }, 2200)

    try {
      const analysis = await analyzeWithClaude(text.trim(), sliderValue, aiTone)
      addAnalysis({ ...analysis, engine: 'claude' })
      setCurrentAnalysis({ ...analysis, engine: 'claude' })
      clearInterval(interval)
      navigate('/analysis')
    } catch (err: unknown) {
      clearInterval(interval)
      if (err instanceof Error && (err.message === 'NO_API_KEY' || err.message === 'INVALID_API_KEY')) {
        // Fall back to the local engine rather than blocking the user entirely.
        const analysis = generateLiteAnalysis(text.trim(), sliderValue, aiTone, selectedEmotion)
        addAnalysis(analysis)
        setCurrentAnalysis(analysis)
        navigate('/analysis')
        return
      }
      setStep('calibrate')
      if (err instanceof Error) {
        setError(`Analysis failed: ${err.message}`)
      }
    }
  }

  if (step === 'loading') {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border border-amber-dim/30 flex items-center justify-center animate-pulse-glow">
            <span className="text-5xl animate-float">🌳</span>
          </div>
          <div className="absolute inset-0 rounded-full border border-amber-glow/20 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <div className="font-display text-xl text-parchment animate-fade-in">{loadingMsg}</div>
          <div className="text-xs text-parchment-muted">This takes 10–20 seconds</div>
        </div>
        <div className="flex gap-1.5">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-dim/60"
              style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-3xl">✦</div>
        <h1 className="font-display text-3xl text-parchment">Daily Check-In</h1>
        <p className="text-parchment-muted text-sm">
          Step 1 of 2 — Share what's present
        </p>
      </div>

      {step === 'input' && (
        <div className="space-y-6 animate-slide-up">
          {!apiKey && (
            <div className="glass-card p-4 border-amber-dim/30 rounded-xl flex items-start gap-3">
              <span className="text-2xl mt-0.5">📖</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-amber-glow text-sm">Running in Lite mode</div>
                <div className="text-parchment-muted text-xs mt-0.5">
                  No API key yet, so your analysis will be generated by WordWise's built-in etymology
                  and wisdom engine — fully functional, just less nuanced than live AI. Add your own
                  free Anthropic key anytime for deeper, personalized analysis.
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link to="/settings" className="btn-primary text-sm py-2 px-4 text-center">Add Key</Link>
                <button onClick={viewDemo} className="btn-ghost text-sm py-2 px-4">View AI Sample</button>
              </div>
            </div>
          )}

          {/* Main text input */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-lg text-amber-glow">{PROMPTS[promptIdx]}</h2>
            <textarea
              className="input-field min-h-[140px]"
              placeholder="Write freely. The more authentic and specific, the deeper the insight..."
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={2000}
            />
            <div className="flex items-center justify-between text-xs text-parchment-muted">
              <span>Be specific — raw words reveal the most</span>
              <span>{text.length}/2000</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => {
              if (!text.trim() || text.trim().length < 10) {
                setError('Please share a bit more — at least a sentence or two.')
                return
              }
              setError('')
              setStep('calibrate')
            }}
            className="btn-primary w-full text-base"
          >
            Continue to Calibration →
          </button>
        </div>
      )}

      {step === 'calibrate' && (
        <div className="space-y-6 animate-slide-up">
          {/* Your input recap */}
          <div className="glass-card p-4 rounded-xl border border-root-border">
            <div className="text-xs text-parchment-muted mb-1">Your input</div>
            <div className="text-sm text-parchment-dim line-clamp-3 italic">"{text}"</div>
            <button onClick={() => setStep('input')} className="text-xs text-amber-glow hover:underline mt-2">
              ← Edit
            </button>
          </div>

          {/* Calibration slider */}
          <div className="glass-card p-6 space-y-6">
            <div>
              <h2 className="font-display text-xl text-parchment mb-1">Calibrate Your State</h2>
              <p className="text-parchment-muted text-sm">
                Intuitively, where do you feel you are right now on the consciousness scale?
              </p>
            </div>

            {/* Current level display */}
            <div className="text-center py-4 px-6 rounded-xl border"
              style={{ borderColor: currentLevel.color + '40', background: currentLevel.bgColor }}>
              <div className="text-4xl font-bold" style={{ color: currentLevel.color }}>{sliderValue}</div>
              <div className="font-display text-xl mt-1" style={{ color: currentLevel.color }}>
                {currentLevel.name}
              </div>
              <div className="text-xs text-parchment-muted mt-1">{currentLevel.emotion}</div>
              <div className="text-xs text-parchment-muted/70 mt-2 max-w-xs mx-auto">{currentLevel.description}</div>
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <input
                type="range"
                min={20}
                max={700}
                step={5}
                value={sliderValue}
                onChange={e => setSliderValue(Number(e.target.value))}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${currentLevel.color} 0%, ${currentLevel.color} ${((sliderValue - 20) / 680) * 100}%, #3d3530 ${((sliderValue - 20) / 680) * 100}%, #3d3530 100%)`,
                }}
              />
              <div className="grid grid-cols-5 gap-1 text-center">
                {HAWKINS_LEVELS.filter((_, i) => i % 3 === 0 || i === HAWKINS_LEVELS.length - 1).slice(0, 5).map(lvl => (
                  <button
                    key={lvl.level}
                    onClick={() => setSliderValue(lvl.level)}
                    className="text-xs py-1.5 px-1 rounded-lg border transition-all"
                    style={{
                      borderColor: lvl.color + '40',
                      color: sliderValue === lvl.level ? lvl.color : '#8a8070',
                      background: sliderValue === lvl.level ? lvl.bgColor : 'transparent',
                    }}
                  >
                    <div>{lvl.level}</div>
                    <div className="font-medium">{lvl.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion quick-pick */}
            <div className="space-y-2">
              <div className="text-xs text-parchment-muted uppercase tracking-widest">Quick pick — dominant emotion</div>
              <div className="flex flex-wrap gap-1.5">
                {CALIBRATION_EMOTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => setSelectedEmotion(e)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      selectedEmotion === e
                        ? 'border-amber-glow bg-amber-dim/20 text-amber-glow'
                        : 'border-root-border text-parchment-muted hover:border-root-muted hover:text-parchment-dim'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-parchment-muted/50 text-center italic">
            The Hawkins scale is a metaphorical map — a useful compass, not scientific territory.
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button onClick={handleAnalyze} className="btn-primary w-full text-base">
            Reveal My Roots & Remedy ✦
          </button>
        </div>
      )}
    </div>
  )
}
