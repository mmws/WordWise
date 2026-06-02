import type { Analysis, AiTone } from '../types'

const TONE_INSTRUCTIONS: Record<AiTone, string> = {
  poetic:     'Write with poetic, mythic depth. Use evocative metaphors, lush language, and lyrical rhythm. Think Rumi meets Carl Jung.',
  direct:     'Write clearly and directly. No flowery language — grounded, practical, and honest. Think a wise mentor speaking plainly.',
  warrior:    'Write with fierce, empowering energy. Bold declarations, strong verbs, no hedging. Think Stoic warrior + Nietzsche.',
  playful:    'Write with lightness and wit. Creative wordplay, surprising angles, a sense of delight. Think Zen koan meets stand-up philosopher.',
  scientific: 'Write with precision and intellectual rigor. Cite mechanisms, use exact language, ground insights in cognitive science and linguistics.',
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

function getApiKey(): string {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem('wordwise_api_key') || ''
}

function buildSystemPrompt(tone: AiTone): string {
  return `You are WordWise — a deeply intelligent linguistic companion for personal transformation. You combine:
- Deep etymology (Latin, Greek, Old English, Proto-Indo-European roots)
- David R. Hawkins' Map of Consciousness (Power vs. Force) as an emotional calibration framework
- NLP principles for behavioral change (reframing, anchoring, positive presuppositions)
- Creative linguistics (neologisms, portmanteaus, mantras) to install empowering mental patterns
- Narrative wisdom from myths, fables, and philosophy

TONE INSTRUCTION: ${TONE_INSTRUCTIONS[tone]}

You never spiritually bypass — you honor shadow before inviting light.

CRITICAL: Always respond with ONLY valid JSON. No markdown, no explanation outside the JSON object.`
}

function buildAnalysisPrompt(userInput: string, calibrationSlider: number): string {
  return `Analyze this user's inner state and generate a full WordWise report.

User's words: "${userInput}"
Self-calibration slider: ${calibrationSlider}/700 (Hawkins scale)

Return a JSON object with EXACTLY this structure:
{
  "dominantEmotion": "one or two words describing the core emotional state",
  "hawkinsLevel": <number 20-700>,
  "hawkinsName": "<level name like Fear, Anger, Courage, etc>",
  "hawkinsRange": [<low end number>, <high end number>],
  "rootInsight": "2-3 sentences on how their language reveals their inner state and what roots are showing",
  "reframe": "2-3 sentences: a NLP-informed reframe that honors where they are and points toward expansion",
  "etymology": [
    {
      "word": "key word from their input",
      "root": "original root word with language",
      "language": "Latin / Greek / Old English / etc",
      "originalMeaning": "what the word originally meant",
      "insight": "1-2 sentences on what this reveals about their experience",
      "wordShadow": "how modern usage distorts or limits the original meaning"
    }
  ],
  "neologisms": [
    {
      "word": "NewWord",
      "definition": "clear definition of this new word",
      "type": "portmanteau",
      "tone": "warrior"
    },
    {
      "word": "AnotherWord",
      "definition": "definition",
      "type": "compound",
      "tone": "gentle"
    },
    {
      "word": "ThirdWord",
      "definition": "definition",
      "type": "verb",
      "tone": "mythic"
    }
  ],
  "mantra": "A single powerful mantra using the neologisms. Short, rhythmic, memorable. Start with 'I'.",
  "wisdom": {
    "myth": {
      "title": "Name of myth or archetype",
      "story": "2-3 sentences on the myth",
      "parallel": "1-2 sentences on how it mirrors the user's situation"
    },
    "fable": {
      "title": "Name of fable",
      "lesson": "2-3 sentences: the fable and its lesson for them"
    },
    "philosophy": {
      "source": "Philosopher / school name",
      "quote": "A real or paraphrased relevant quote",
      "application": "1-2 sentences applying it to their situation"
    },
    "stoic": "A single Stoic micro-lesson, 1-2 sentences, practical and grounded"
  }
}

Etymology array: include 2-3 key words from their input.
Neologisms: create exactly 3, each with a different tone (warrior, gentle, mythic, playful, or scientific).
Make neologisms beautiful, memorable, and phonetically pleasing. They should feel like real words.
The mantra should use 1-2 of the neologisms and feel powerful to say aloud.`
}

export async function analyzeWithClaude(
  userInput: string,
  calibrationSlider: number,
  tone: AiTone = 'poetic',
  onProgress?: (chunk: string) => void
): Promise<Analysis> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('NO_API_KEY')
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: buildSystemPrompt(tone),
      messages: [
        {
          role: 'user',
          content: buildAnalysisPrompt(userInput, calibrationSlider),
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    if (response.status === 401) throw new Error('INVALID_API_KEY')
    throw new Error(`API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text

  if (!content) throw new Error('Empty response from Claude')

  // Parse JSON — extract from markdown fences if present
  let jsonStr = content.trim()
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  } else {
    // Find first { to last } in case of extra text
    const start = jsonStr.indexOf('{')
    const end = jsonStr.lastIndexOf('}')
    if (start !== -1 && end !== -1) jsonStr = jsonStr.slice(start, end + 1)
  }

  const parsed = JSON.parse(jsonStr)

  const analysis: Analysis = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    userInput,
    ...parsed,
  }

  return analysis
}

export function saveApiKey(key: string): void {
  localStorage.setItem('wordwise_api_key', key)
}

export function loadApiKey(): string {
  return localStorage.getItem('wordwise_api_key') || ''
}
