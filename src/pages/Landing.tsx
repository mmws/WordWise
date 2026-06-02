import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🌱',
    title: 'Etymology Engine',
    desc: 'Trace your words to their Latin, Greek, and Proto-Indo-European roots. Discover the hidden assumptions living in your language.',
  },
  {
    icon: '📊',
    title: 'Hawkins Calibration',
    desc: "Map your state on David Hawkins' Map of Consciousness. Understand the gap between where you think you are and where your words say you are.",
  },
  {
    icon: '✦',
    title: 'Neologism Forge',
    desc: 'Three brand-new words created for your exact situation — portmanteaus, compounds, and invented verbs to install as mental software.',
  },
  {
    icon: '📜',
    title: 'Wisdom Library',
    desc: 'Matched myths, fables, philosophy, and Stoic micro-lessons drawn from the full arc of human wisdom literature.',
  },
  {
    icon: '💞',
    title: 'Relationship Mode',
    desc: 'Describe a conflict. Map both parties\' calibration levels. Generate a repair lexicon and Hanlon\'s Razor reframe.',
  },
  {
    icon: '⚗️',
    title: 'Goal Forge',
    desc: 'Enter a vague goal. Receive a high-calibration Power Declaration, etymological audit, and calibration path.',
  },
]

const EXAMPLE = {
  input: '"I keep putting things off and I don\'t know why."',
  emotion: 'Avoidance',
  level: 125,
  levelName: 'Desire',
  etymology: {
    word: 'Procrastinate',
    root: 'Latin: pro (forward) + crastinus (of tomorrow)',
    insight: 'To put forward into tomorrow — the word itself reveals the mechanism.',
  },
  neologisms: ['Nowward', 'Presentify', 'Momentforge'],
  mantra: 'I move Nowward. Tomorrow is an illusion that dissolves in action.',
}

export default function Landing() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="text-center py-20 space-y-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,162,76,0.08) 0%, transparent 70%)' }} />
        <div className="text-6xl animate-float">🌳</div>
        <h1 className="font-display text-5xl md:text-6xl text-gradient leading-tight">
          WordWise
        </h1>
        <p className="text-parchment-dim text-xl max-w-lg mx-auto leading-relaxed">
          Understand the roots of how you feel.<br />
          <em className="text-amber-glow">Forge the words to become who you're meant to be.</em>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/checkin" className="btn-primary text-base px-8 py-3">
            Begin Your First Check-In ✦
          </Link>
          <Link to="/settings" className="btn-ghost text-base px-8 py-3">
            Set Up API Key →
          </Link>
        </div>
        <p className="text-xs text-parchment-muted/50">
          Powered by Claude · Your data stays local · ~$0.02 per analysis
        </p>
      </section>

      {/* The insight */}
      <section className="glass-card p-8 mb-12 text-center space-y-4 amber-glow">
        <div className="text-3xl">💡</div>
        <h2 className="font-display text-2xl text-parchment">The Core Insight</h2>
        <p className="text-parchment-dim text-base leading-relaxed max-w-2xl mx-auto">
          Your word choices are a more honest mirror than your self-assessment.
          The gap between where you <em>think</em> you are and where your language <em>lands</em>
          — that gap is where the transformation lives.
        </p>
      </section>

      {/* Live example */}
      <section className="mb-14 space-y-4">
        <h2 className="font-display text-2xl text-parchment text-center">See It in Action</h2>
        <div className="glass-card p-6 space-y-5 max-w-2xl mx-auto">
          <div className="bg-root-surface rounded-xl p-4 border border-root-border">
            <div className="text-xs text-parchment-muted uppercase tracking-wider mb-2">User says</div>
            <div className="text-parchment-dim italic text-sm">{EXAMPLE.input}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-root-surface rounded-xl p-4 text-center">
              <div className="text-xs text-parchment-muted mb-1">Detected emotion</div>
              <div className="font-display text-lg text-parchment">{EXAMPLE.emotion}</div>
            </div>
            <div className="bg-root-surface rounded-xl p-4 text-center">
              <div className="text-xs text-parchment-muted mb-1">Calibration level</div>
              <div className="font-bold text-2xl text-amber-glow">{EXAMPLE.level}</div>
              <div className="text-xs text-amber-dim">{EXAMPLE.levelName}</div>
            </div>
          </div>

          <div className="bg-root-surface rounded-xl p-4 space-y-2">
            <div className="text-xs text-parchment-muted uppercase tracking-wider">Etymology</div>
            <div className="font-display text-lg text-amber-glow">{EXAMPLE.etymology.word}</div>
            <div className="text-xs text-parchment-muted italic">{EXAMPLE.etymology.root}</div>
            <p className="text-parchment-dim text-sm">{EXAMPLE.etymology.insight}</p>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-parchment-muted uppercase tracking-wider">Forged words</div>
            <div className="flex gap-2 flex-wrap">
              {EXAMPLE.neologisms.map(n => (
                <span key={n} className="px-3 py-1.5 rounded-full border border-amber-dim/30 bg-amber-dim/10 text-amber-glow text-sm font-display">
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center py-3 px-4 rounded-xl bg-root-bg border border-amber-dim/20 amber-glow">
            <div className="text-xs text-parchment-muted mb-1">Your mantra</div>
            <div className="font-display text-amber-glow italic">"{EXAMPLE.mantra}"</div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mb-14 space-y-6">
        <h2 className="font-display text-2xl text-parchment text-center">Everything Inside</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card p-5 flex gap-4">
              <div className="text-3xl shrink-0 mt-0.5">{f.icon}</div>
              <div>
                <h3 className="font-medium text-parchment text-base mb-1">{f.title}</h3>
                <p className="text-parchment-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="mb-14 glass-card p-8 space-y-4">
        <h2 className="font-display text-2xl text-parchment">The Philosophy</h2>
        <div className="space-y-4 text-parchment-dim text-sm leading-relaxed">
          <p>
            Language is not just how we communicate — it's the operating system of the mind.
            The words we habitually use create the emotional states we live inside.
            "I'm <em>trapped</em>" activates different neurology than "I'm <em>navigating</em>."
          </p>
          <p>
            WordWise combines three frameworks: <strong className="text-parchment">etymology</strong> (to reveal what your words are doing beneath the surface),
            <strong className="text-parchment"> Hawkins' Map of Consciousness</strong> (to locate your current state in a calibration hierarchy),
            and <strong className="text-parchment">creative linguistics</strong> (to install new mental software through neologisms and mantras).
          </p>
          <p>
            This is linguistic archaeology meets cognitive reprogramming. Not therapy — a forge.
          </p>
        </div>
        <div className="border-t border-root-border pt-4 text-xs text-parchment-muted/50 italic">
          Note: WordWise is a reflective companion, not a medical or therapeutic tool.
          The Hawkins scale is used as a metaphorical map — a useful compass, not scientific territory.
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 space-y-4">
        <div className="text-4xl">🌳</div>
        <h2 className="font-display text-3xl text-gradient">Ready to forge your words?</h2>
        <p className="text-parchment-muted text-sm">Add your API key in Settings, then begin your first check-in.</p>
        <div className="flex gap-3 justify-center pt-2">
          <Link to="/settings" className="btn-primary text-base px-8">Get Started →</Link>
        </div>
      </section>
    </div>
  )
}
