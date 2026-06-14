import type { Analysis, AiTone, Etymology, Neologism } from '../types'
import { getLevelForScore } from '../hawkins'
import { ETYMOLOGY_BANK, ETYMOLOGY_KEYS } from '../data/etymologyBank'
import { WISDOM_BANK, getWisdomTier, type WisdomTheme } from '../data/wisdomBank'
import { getNeologismsForTheme } from '../data/neologismBank'

// Maps the app's AI tone to the closest neologism tone in the local bank.
const TONE_MAP: Record<AiTone, Neologism['tone']> = {
  poetic: 'mythic',
  direct: 'scientific',
  warrior: 'warrior',
  playful: 'playful',
  scientific: 'scientific',
}

// Keyword groups used to detect the dominant emotional theme of the user's input.
const THEME_KEYWORDS: Record<WisdomTheme, string[]> = {
  avoidance: [
    'procrastinate', 'procrastinating', 'avoid', 'avoiding', 'avoidance', 'escape', 'escaping',
    'stuck', 'trapped', 'lost', 'hide', 'hiding', 'delay', 'delaying', 'distract', 'distracted',
    'putting off', 'put off',
  ],
  fear: [
    'afraid', 'fear', 'fears', 'fearful', 'anxious', 'anxiety', 'worry', 'worried', 'worrying',
    'scared', 'nervous', 'doubt', 'doubting', 'panic', 'uncertain', 'uncertainty', 'insecure',
  ],
  anger: [
    'anger', 'angry', 'mad', 'frustrated', 'frustration', 'hate', 'rage', 'irritated',
    'irritation', 'resentment', 'resentful', 'furious', 'annoyed',
  ],
  overwhelm: [
    'overwhelmed', 'overwhelm', 'stress', 'stressed', 'busy', 'exhausted', 'exhaustion', 'tired',
    'chaos', 'chaotic', 'too much', 'drowning', 'burnout', 'burned out',
  ],
  sadness: [
    'sad', 'sadness', 'lonely', 'loneliness', 'alone', 'hurt', 'grief', 'grieving', 'broken',
    'hopeless', 'empty', 'depressed', 'down', 'heartbroken', 'numb',
  ],
  growth: [
    'growth', 'grow', 'growing', 'change', 'changing', 'learn', 'learning', 'improve',
    'improving', 'better', 'hope', 'hopeful', 'motivation', 'motivated', 'courage', 'progress',
  ],
  general: [],
}

// Fallback etymology word keys per theme, used when no direct match is found in the input.
const THEME_FALLBACK_WORDS: Record<WisdomTheme, string[]> = {
  avoidance: ['procrastinate', 'avoid'],
  fear: ['afraid', 'anxious'],
  anger: ['anger', 'stress'],
  overwhelm: ['overwhelmed', 'tired'],
  sadness: ['sad', 'lonely'],
  growth: ['change', 'growth'],
  general: ['stuck', 'change'],
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

// Very light stemming so "stuck"/"stuck", "tired"/"tiredness", "avoiding"/"avoid" etc. match.
function stem(word: string): string[] {
  const candidates = new Set<string>([word])
  if (word.endsWith('ing') && word.length > 5) candidates.add(word.slice(0, -3))
  if (word.endsWith('ed') && word.length > 4) candidates.add(word.slice(0, -2))
  if (word.endsWith('es') && word.length > 4) candidates.add(word.slice(0, -2))
  if (word.endsWith('s') && word.length > 3) candidates.add(word.slice(0, -1))
  if (word.endsWith('ness') && word.length > 6) candidates.add(word.slice(0, -4))
  if (word.endsWith('ly') && word.length > 4) candidates.add(word.slice(0, -2))
  return Array.from(candidates)
}

function detectTheme(text: string): WisdomTheme {
  const lower = text.toLowerCase()
  const scores: Record<WisdomTheme, number> = {
    avoidance: 0, fear: 0, anger: 0, overwhelm: 0, sadness: 0, growth: 0, general: 0,
  }
  for (const [theme, words] of Object.entries(THEME_KEYWORDS) as [WisdomTheme, string[]][]) {
    for (const phrase of words) {
      if (lower.includes(phrase)) scores[theme] += 1
    }
  }
  let best: WisdomTheme = 'general'
  let bestScore = 0
  for (const [theme, score] of Object.entries(scores) as [WisdomTheme, number][]) {
    if (score > bestScore) {
      best = theme
      bestScore = score
    }
  }
  return bestScore > 0 ? best : 'general'
}

function findEtymologyMatches(text: string, theme: WisdomTheme): Etymology[] {
  const tokens = tokenize(text)
  const found: Etymology[] = []
  const seen = new Set<string>()

  for (const token of tokens) {
    if (found.length >= 2) break
    for (const candidate of stem(token)) {
      if (ETYMOLOGY_BANK[candidate] && !seen.has(candidate)) {
        seen.add(candidate)
        found.push(ETYMOLOGY_BANK[candidate])
        break
      }
    }
  }

  if (found.length === 0) {
    for (const key of THEME_FALLBACK_WORDS[theme]) {
      if (ETYMOLOGY_BANK[key]) found.push(ETYMOLOGY_BANK[key])
    }
  } else if (found.length === 1) {
    // Add one more for fullness, preferring the theme fallback, then any other key.
    const fallbacks = [...THEME_FALLBACK_WORDS[theme], ...ETYMOLOGY_KEYS]
    for (const key of fallbacks) {
      if (!seen.has(key) && ETYMOLOGY_BANK[key]) {
        found.push(ETYMOLOGY_BANK[key])
        break
      }
    }
  }

  return found
}

function buildMantra(neologisms: Neologism[], theme: WisdomTheme): string {
  const n0 = neologisms[0]
  const n1 = neologisms[1]
  if (!n0) return 'I am the words I choose, and I choose again, right now.'
  if (!n1) return `I move toward ${n0.word.toLowerCase()}, one small step at a time.`

  const templates: Record<WisdomTheme, string> = {
    avoidance: `I ${n0.word.toLowerCase()} the next small step, and let ${n1.word.toLowerCase()} carry the rest.`,
    fear: `Before the fear decides for me, I take one ${n0.word.toLowerCase()} — and ${n1.word.toLowerCase()} from there.`,
    anger: `I let ${n0.word.toLowerCase()} cool what's hot, and ${n1.word.toLowerCase()} guide what's next.`,
    overwhelm: `I ${n1.word.toLowerCase()}, choose one thing, and ${n0.word.toLowerCase()} the rest until later.`,
    sadness: `I let myself ${n0.word.toLowerCase()}, trusting that I am also ${n1.word.toLowerCase()}.`,
    growth: `Today I am ${n0.word.toLowerCase()} — and every small ${n1.word.toLowerCase()} step counts.`,
    general: `I am ${n0.word.toLowerCase()}, and I am ${n1.word.toLowerCase()} — both, right now.`,
  }
  return templates[theme]
}

function buildRootInsight(etymology: Etymology[], theme: WisdomTheme, userInput: string): string {
  const primary = etymology[0]
  const wordCount = userInput.trim().split(/\s+/).length
  const lengthNote = wordCount < 15
    ? 'In just a few words, your language already points somewhere specific.'
    : 'Across what you wrote, one thread keeps surfacing.'

  if (!primary) {
    return `${lengthNote} The feeling you're describing doesn't reduce to a single word — but naming it, even loosely, is the first move language can make for you.`
  }

  return `${lengthNote} The word "${primary.word.toLowerCase()}" carries a history worth noticing: ${primary.insight} ${primary.wordShadow}`
}

function buildReframe(etymology: Etymology[], theme: WisdomTheme, neologisms: Neologism[]): string {
  const n0 = neologisms[0]
  const secondary = etymology[1] ?? etymology[0]

  const themeReframes: Record<WisdomTheme, string> = {
    avoidance: 'What if the delay isn\'t the problem to solve, but a signal pointing at what feels unclear or unsafe about starting?',
    fear: 'What if the fear is information about what matters to you, not a verdict on what you\'re capable of?',
    anger: 'What if the heat is protecting something underneath it — a boundary, a hope, a loss — that deserves a more direct hearing?',
    overwhelm: 'What if the goal right now isn\'t to do everything, but to find the one thing that, if done, would make the rest lighter?',
    sadness: 'What if this feeling isn\'t a problem to fix quickly, but information that something mattered — and still does?',
    growth: 'What if the discomfort of changing is itself evidence that something is already moving, not a sign that something is wrong?',
    general: 'What if the words you used to describe this aren\'t the only words available — and choosing different ones could open a different door?',
  }

  const base = themeReframes[theme]
  const wordNote = secondary
    ? ` Notice that "${secondary.word.toLowerCase()}" didn't always mean what it means today — words drift, and so can the meaning you're assigning to this moment.`
    : ''
  const neoNote = n0 ? ` Try holding the word "${n0.word}" — ${n0.definition.toLowerCase()}` : ''

  return `${base}${wordNote}${neoNote}`
}

/**
 * Generates a complete Analysis object using local heuristics — no API call required.
 * Used as the "Lite" engine when the user has no Anthropic API key configured.
 */
export function generateLiteAnalysis(
  userInput: string,
  calibrationSlider: number,
  aiTone: AiTone,
  dominantEmotionOverride?: string
): Analysis {
  const level = getLevelForScore(calibrationSlider)
  const theme = detectTheme(userInput)
  const etymology = findEtymologyMatches(userInput, theme)
  const preferredTone = TONE_MAP[aiTone] ?? 'mythic'
  const neologisms = getNeologismsForTheme(theme, preferredTone, 3)
  const tier = getWisdomTier(calibrationSlider)
  const tierEntries = WISDOM_BANK[tier]
  const wisdomEntry =
    tierEntries.find(w => w.themes.includes(theme)) ?? tierEntries[0]

  const mantra = buildMantra(neologisms, theme)
  const rootInsight = buildRootInsight(etymology, theme, userInput)
  const reframe = buildReframe(etymology, theme, neologisms)

  const dominantEmotion =
    dominantEmotionOverride?.trim() ||
    (theme !== 'general'
      ? theme.charAt(0).toUpperCase() + theme.slice(1)
      : level.emotion.split('/')[0].trim())

  return {
    id: `lite-${Date.now()}`,
    timestamp: Date.now(),
    userInput: userInput.trim(),
    dominantEmotion,
    hawkinsLevel: calibrationSlider,
    hawkinsName: level.name,
    hawkinsRange: [level.level, level.level + 25],
    etymology,
    neologisms,
    mantra,
    wisdom: {
      myth: wisdomEntry.myth,
      fable: wisdomEntry.fable,
      philosophy: wisdomEntry.philosophy,
      stoic: wisdomEntry.stoic,
    },
    rootInsight,
    reframe,
    engine: 'lite',
  }
}
