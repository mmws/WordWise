import type { Neologism } from '../types'
import type { WisdomTheme } from './wisdomBank'

export interface NeologismEntry extends Neologism {
  themes: WisdomTheme[]
}

// A pool of pre-written neologisms, tagged by tone and emotional theme,
// for selection by the local "Lite" analysis engine.
export const NEOLOGISM_BANK: NeologismEntry[] = [
  {
    word: 'Nowward',
    definition: 'Oriented toward the present moment as a direction of motion, not just a point in time.',
    type: 'adjective',
    tone: 'warrior',
    themes: ['avoidance', 'overwhelm', 'general'],
  },
  {
    word: 'Presentify',
    definition: 'To take a vague future task and translate it into one concrete action available right now.',
    type: 'verb',
    tone: 'scientific',
    themes: ['avoidance', 'overwhelm', 'general'],
  },
  {
    word: 'Momentforge',
    definition: 'The small workshop of the present moment, where intentions are hammered into action.',
    type: 'compound',
    tone: 'mythic',
    themes: ['avoidance', 'growth', 'general'],
  },
  {
    word: 'Griefire',
    definition: 'The heat that rises when grief and anger share the same root — a portmanteau naming what anger often actually is.',
    type: 'portmanteau',
    tone: 'mythic',
    themes: ['anger', 'sadness'],
  },
  {
    word: 'Unclench',
    definition: 'To consciously release a held tension — physical or mental — that you didn\'t notice you were holding.',
    type: 'verb',
    tone: 'gentle',
    themes: ['anger', 'fear', 'overwhelm'],
  },
  {
    word: 'Slowcraft',
    definition: 'The deliberate practice of doing one thing at reduced speed in order to see it clearly.',
    type: 'compound',
    tone: 'scientific',
    themes: ['overwhelm', 'growth', 'general'],
  },
  {
    word: 'Threadlight',
    definition: 'The single visible next step that illuminates a path through an otherwise dark or confusing situation.',
    type: 'compound',
    tone: 'mythic',
    themes: ['fear', 'overwhelm', 'general'],
  },
  {
    word: 'Tendwards',
    definition: 'Moving in the direction of care — toward tending something (a task, a relationship, yourself) rather than away from it.',
    type: 'adjective',
    tone: 'gentle',
    themes: ['sadness', 'growth', 'general'],
  },
  {
    word: 'Rootcheck',
    definition: 'A brief pause to ask "what is this feeling actually about, underneath?" before reacting.',
    type: 'compound',
    tone: 'scientific',
    themes: ['anger', 'fear', 'general'],
  },
  {
    word: 'Bravebreath',
    definition: 'A single deliberate breath taken specifically before doing the thing you\'re afraid of — not to calm down, but to begin.',
    type: 'compound',
    tone: 'warrior',
    themes: ['fear', 'avoidance', 'general'],
  },
  {
    word: 'Wonderloop',
    definition: 'A repeating cycle of curiosity that replaces a repeating cycle of worry — same shape, different fuel.',
    type: 'compound',
    tone: 'playful',
    themes: ['fear', 'overwhelm', 'growth'],
  },
  {
    word: 'Lighten',
    definition: '(reclaimed) To make lighter in weight — used here for the act of setting down a burden you\'ve been carrying out of habit, not necessity.',
    type: 'verb',
    tone: 'gentle',
    themes: ['overwhelm', 'sadness', 'general'],
  },
  {
    word: 'Spiralwise',
    definition: 'Recognizing that returning to a familiar struggle isn\'t going in circles — it\'s a spiral, and you\'re higher up than last time.',
    type: 'adjective',
    tone: 'mythic',
    themes: ['growth', 'sadness', 'general'],
  },
  {
    word: 'Edgewalk',
    definition: 'To move along the boundary of your comfort zone deliberately, neither retreating nor leaping.',
    type: 'verb',
    tone: 'warrior',
    themes: ['fear', 'growth', 'general'],
  },
  {
    word: 'Quietforce',
    definition: 'A portmanteau naming the kind of strength that doesn\'t announce itself — steady, undramatic, and often underestimated.',
    type: 'portmanteau',
    tone: 'mythic',
    themes: ['anger', 'growth', 'general'],
  },
  {
    word: 'Unspiral',
    definition: 'To interrupt a worry-spiral at any point, not necessarily at the beginning — any exit counts.',
    type: 'verb',
    tone: 'scientific',
    themes: ['fear', 'overwhelm'],
  },
  {
    word: 'Softanchor',
    definition: 'A small, kind fact you return to when everything else feels uncertain — not a fix, just a place to stand.',
    type: 'compound',
    tone: 'gentle',
    themes: ['fear', 'sadness', 'general'],
  },
  {
    word: 'Playforward',
    definition: 'To approach a serious task with a spirit of experimentation, lowering the stakes enough to actually begin.',
    type: 'verb',
    tone: 'playful',
    themes: ['avoidance', 'fear', 'general'],
  },
  {
    word: 'Restwell',
    definition: 'Rest treated as a skill to be done well, not a failure to keep going — the opposite of "collapsing."',
    type: 'compound',
    tone: 'gentle',
    themes: ['overwhelm', 'sadness', 'general'],
  },
  {
    word: 'Clearward',
    definition: 'Moving toward clarity as a direction, even before clarity has arrived — you can head clearward before you feel clear.',
    type: 'adjective',
    tone: 'scientific',
    themes: ['growth', 'general', 'overwhelm'],
  },
]

export function getNeologismsForTheme(theme: WisdomTheme, preferredTone?: Neologism['tone'], count = 3): Neologism[] {
  const pool = NEOLOGISM_BANK.filter(n => n.themes.includes(theme) || n.themes.includes('general'))
  const sorted = [...pool].sort((a, b) => {
    const aMatch = a.tone === preferredTone ? 1 : 0
    const bMatch = b.tone === preferredTone ? 1 : 0
    return bMatch - aMatch
  })
  const result: Neologism[] = []
  const seen = new Set<string>()
  for (const entry of sorted) {
    if (seen.has(entry.word)) continue
    seen.add(entry.word)
    result.push({ word: entry.word, definition: entry.definition, type: entry.type, tone: entry.tone })
    if (result.length >= count) break
  }
  return result
}
