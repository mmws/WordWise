import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { saveApiKey, loadApiKey } from '../services/claude'
import type { AiTone } from '../types'

const TONES: { id: AiTone; label: string; icon: string; desc: string }[] = [
  { id: 'poetic',     label: 'Poetic & Mythic',      icon: '🌙', desc: 'Rumi meets Carl Jung — lush, layered, lyrical' },
  { id: 'direct',     label: 'Direct & Grounded',     icon: '🪨', desc: 'Plain-spoken wisdom, no flourishes' },
  { id: 'warrior',    label: 'Warrior & Fierce',      icon: '⚔️', desc: 'Bold, empowering, Stoic-warrior energy' },
  { id: 'playful',    label: 'Playful & Witty',       icon: '✨', desc: 'Zen koan meets stand-up philosopher' },
  { id: 'scientific', label: 'Scientific & Precise',  icon: '🔬', desc: 'Cognitive science, linguistics, rigorous' },
]

export default function Settings() {
  const { setApiKey, aiTone, setAiTone } = useApp()
  const [keyInput, setKeyInput] = useState(loadApiKey())
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    const trimmed = keyInput.trim()
    saveApiKey(trimmed)
    setApiKey(trimmed)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const maskedKey = keyInput
    ? keyInput.startsWith('sk-ant-') ? keyInput.slice(0, 14) + '...' + keyInput.slice(-4) : '(set)'
    : ''

  return (
    <div className="animate-fade-in max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl text-parchment">Settings</h1>
        <p className="text-parchment-muted text-sm mt-1">Configure your WordWise experience</p>
      </div>

      {/* API Key */}
      <div className="glass-card p-6 space-y-5">
        <div>
          <h2 className="font-medium text-parchment text-base">Anthropic API Key</h2>
          <p className="text-parchment-muted text-sm mt-1">
            WordWise uses Claude (claude-opus-4-6) for etymology analysis, neologism generation, and wisdom matching.
            Your key is stored locally and never sent anywhere except Anthropic's API.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-parchment-muted uppercase tracking-wider">API Key</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              className="input-field pr-16 font-mono text-sm"
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-parchment-muted hover:text-parchment"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {maskedKey && !show && (
            <div className="text-xs text-parchment-muted">Current: {maskedKey}</div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!keyInput.trim()}
          className={`btn-primary w-full ${!keyInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saved ? '✓ Saved!' : 'Save API Key'}
        </button>

        <div className="rounded-xl bg-root-surface border border-root-border p-4 text-xs text-parchment-muted space-y-2">
          <div className="font-medium text-parchment">How to get your key:</div>
          <ol className="list-decimal list-inside space-y-1 text-parchment-muted">
            <li>Go to <span className="text-amber-glow">console.anthropic.com</span></li>
            <li>Sign up or log in</li>
            <li>Navigate to API Keys</li>
            <li>Create a new key and paste it above</li>
          </ol>
          <div className="pt-1 text-parchment-muted/70 italic">
            Note: API calls are charged to your Anthropic account. Each analysis uses ~1–2k tokens (~$0.01–0.03 with claude-opus-4-6).
          </div>
        </div>
      </div>

      {/* Tone Picker */}
      <div className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-medium text-parchment text-base">AI Response Tone</h2>
          <p className="text-parchment-muted text-sm mt-1">
            Choose how Claude speaks to you in analyses, neologisms, and wisdom.
          </p>
        </div>
        <div className="space-y-2">
          {TONES.map(t => (
            <button
              key={t.id}
              onClick={() => setAiTone(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                aiTone === t.id
                  ? 'border-amber-glow bg-amber-dim/15 text-parchment'
                  : 'border-root-border text-parchment-muted hover:border-root-muted hover:bg-root-surface/50'
              }`}
            >
              <span className="text-xl w-7 text-center">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${aiTone === t.id ? 'text-amber-glow' : ''}`}>{t.label}</div>
                <div className="text-xs text-parchment-muted mt-0.5">{t.desc}</div>
              </div>
              {aiTone === t.id && <span className="text-amber-glow text-sm shrink-0">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-medium text-parchment">About WordWise</h2>
        <div className="text-sm text-parchment-muted space-y-3 leading-relaxed">
          <p>
            WordWise treats language as the primary lever for personal transformation, combining etymology,
            NLP principles, Hawkins' Map of Consciousness, creative linguistics, and narrative wisdom.
          </p>
          <p>
            <strong className="text-parchment-dim">A note on the Hawkins scale:</strong> The consciousness
            calibration framework is used here as a metaphorical map — a useful compass for self-reflection,
            not a scientifically validated measurement. Trust your own discernment.
          </p>
          <p>
            <strong className="text-parchment-dim">Mental health disclaimer:</strong> WordWise is a
            reflective tool, not a medical or therapeutic application. If you're experiencing persistent
            distress, please reach out to a qualified professional.
          </p>
        </div>
        <div className="text-xs text-parchment-muted/50 italic text-center">
          "Understand the roots of how you feel.<br />Forge the words to become who you're meant to be."
        </div>
      </div>

      {/* Privacy */}
      <div className="glass-card p-6 space-y-3">
        <h2 className="font-medium text-parchment">Privacy</h2>
        <div className="text-sm text-parchment-muted space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>All data (analyses, lexicon, progress) stored locally in your browser</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>API key stored in localStorage, never transmitted to third parties</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Your check-in text is sent only to Anthropic's API for analysis</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-glow mt-0.5">→</span>
            <span>Review <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer"
              className="text-amber-glow underline">Anthropic's privacy policy</a> for API data handling</span>
          </div>
        </div>
      </div>
    </div>
  )
}
