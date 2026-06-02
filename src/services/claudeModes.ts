import type { AiTone } from '../types'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

function getApiKey(): string {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem('wordwise_api_key') || ''
}

// ── RELATIONSHIP MODE ─────────────────────────────────────────────────────────

export interface RelationshipAnalysis {
  id: string
  timestamp: number
  userInput: string
  situation: string
  selfLevel: number
  selfLevelName: string
  otherLevel: number
  otherLevelName: string
  selfRootWords: { word: string; root: string; insight: string }[]
  dynamicInsight: string
  hanlonsRazor: string
  neologisms: { word: string; definition: string; tone: string }[]
  repairMantra: string
  repairLexicon: string[]
  wisdom: { source: string; quote: string; application: string }
  nextStep: string
}

export async function analyzeRelationship(
  userInput: string,
  tone: AiTone = 'poetic'
): Promise<RelationshipAnalysis> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')

  const toneHint = {
    poetic: 'Write with warmth and depth, poetic but clear.',
    direct: 'Write clearly and practically. No fluff.',
    warrior: 'Write with fierce compassion and directness.',
    playful: 'Write with lightness but genuine insight.',
    scientific: 'Write with precision, referencing psychology where relevant.',
  }[tone]

  const system = `You are WordWise's Relationship Mode — a linguistic and emotional intelligence guide specializing in interpersonal dynamics. You use etymology, Hawkins' calibration levels, NLP, and relational psychology to illuminate conflict and create pathways to repair. Tone: ${toneHint}. CRITICAL: Respond only with valid JSON.`

  const prompt = `Analyze this relationship situation and generate a WordWise Relationship Report.

User's description: "${userInput}"

Return ONLY this JSON:
{
  "situation": "one sentence summarizing the core dynamic",
  "selfLevel": <number 20-700, user's likely calibration level based on their language>,
  "selfLevelName": "<level name>",
  "otherLevel": <number 20-700, estimated level of the other party based on described behavior>,
  "otherLevelName": "<level name>",
  "selfRootWords": [
    { "word": "key word user used", "root": "etymology root", "insight": "what this reveals about their position" },
    { "word": "another word", "root": "root", "insight": "insight" }
  ],
  "dynamicInsight": "2-3 sentences: the core energetic/linguistic dynamic between both parties. What calibration gap exists?",
  "hanlonsRazor": "1-2 sentences applying Hanlon's Razor — what lower calibration state might explain the other's behavior, NOT malice?",
  "neologisms": [
    { "word": "RelationalNewWord", "definition": "definition", "tone": "gentle" },
    { "word": "AnotherWord", "definition": "definition", "tone": "mythic" },
    { "word": "ThirdWord", "definition": "definition", "tone": "warrior" }
  ],
  "repairMantra": "A short powerful mantra for navigating this dynamic. Start with 'I'.",
  "repairLexicon": ["phrase1", "phrase2", "phrase3"],
  "wisdom": {
    "source": "philosopher/tradition",
    "quote": "relevant quote",
    "application": "1-2 sentences applying it to this situation"
  },
  "nextStep": "One concrete, specific action the user could take in the next 24 hours to shift the dynamic."
}`

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
      max_tokens: 1800,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    if (response.status === 401) throw new Error('INVALID_API_KEY')
    throw new Error(`API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text
  if (!content) throw new Error('Empty response')

  let jsonStr = content.trim()
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  } else {
    const start = jsonStr.indexOf('{')
    const end = jsonStr.lastIndexOf('}')
    if (start !== -1 && end !== -1) jsonStr = jsonStr.slice(start, end + 1)
  }

  const parsed = JSON.parse(jsonStr)
  return { id: crypto.randomUUID(), timestamp: Date.now(), userInput, ...parsed }
}

// ── GOAL FORGE MODE ───────────────────────────────────────────────────────────

export interface GoalForgeResult {
  id: string
  timestamp: number
  userGoal: string
  originalLevel: number
  originalLevelName: string
  goalEtymology: { word: string; root: string; originalMeaning: string; insight: string }[]
  limitingAssumptions: string[]
  forgedGoal: string
  powerDeclaration: string
  neologisms: { word: string; definition: string }[]
  actionAnchors: string[]
  calibrationPath: { level: number; levelName: string; milestone: string }[]
  mantra: string
}

export async function forgeGoal(
  userGoal: string,
  tone: AiTone = 'poetic'
): Promise<GoalForgeResult> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')

  const toneHint = {
    poetic: 'Write with inspiring, mythic depth.',
    direct: 'Write concisely and powerfully. No filler.',
    warrior: 'Write with fierce, action-oriented energy.',
    playful: 'Write with creativity and unexpected angles.',
    scientific: 'Write with precision, grounding in psychology and linguistics.',
  }[tone]

  const system = `You are WordWise's Goal Forge — a linguistic alchemy engine that transforms vague, low-calibration goals into etymologically rich, high-consciousness Power Declarations. You use Hawkins' Map, etymology, NLP, and creative linguistics. Tone: ${toneHint}. CRITICAL: Respond only with valid JSON.`

  const prompt = `Transform this goal into a WordWise Power Declaration.

User's goal: "${userGoal}"

Return ONLY this JSON:
{
  "originalLevel": <number 20-700: the Hawkins calibration of the goal as stated>,
  "originalLevelName": "<level name>",
  "goalEtymology": [
    { "word": "key word from goal", "root": "etymology root", "originalMeaning": "original meaning", "insight": "what this reveals about current goal framing" },
    { "word": "another word", "root": "root", "originalMeaning": "meaning", "insight": "insight" }
  ],
  "limitingAssumptions": ["assumption 1 hidden in the original language", "assumption 2", "assumption 3"],
  "forgedGoal": "The goal rewritten in high-calibration, etymologically grounded, NLP-clean language. Should be 1-2 sentences, specific and empowering.",
  "powerDeclaration": "A bold, first-person declaration (3-5 sentences) that embodies the forged goal. Present tense. Mythic yet grounded.",
  "neologisms": [
    { "word": "ForgedWord1", "definition": "definition specific to this goal" },
    { "word": "ForgedWord2", "definition": "definition" }
  ],
  "actionAnchors": ["concrete action 1 to take this week", "action 2", "action 3"],
  "calibrationPath": [
    { "level": <number>, "levelName": "<name>", "milestone": "what achieving this milestone looks like" },
    { "level": <higher number>, "levelName": "<name>", "milestone": "milestone" },
    { "level": <higher number>, "levelName": "<name>", "milestone": "ultimate milestone" }
  ],
  "mantra": "A short, powerful mantra distilling the forged goal. Start with 'I'."
}`

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
      max_tokens: 1800,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    if (response.status === 401) throw new Error('INVALID_API_KEY')
    throw new Error(`API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text
  if (!content) throw new Error('Empty response')

  let jsonStr = content.trim()
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  } else {
    const start = jsonStr.indexOf('{')
    const end = jsonStr.lastIndexOf('}')
    if (start !== -1 && end !== -1) jsonStr = jsonStr.slice(start, end + 1)
  }

  const parsed = JSON.parse(jsonStr)
  return { id: crypto.randomUUID(), timestamp: Date.now(), userGoal, ...parsed }
}
