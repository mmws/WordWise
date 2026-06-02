export interface HawkinsLevel {
  level: number
  name: string
  emotion: string
  description: string
  color: string
  bgColor: string
  power: 'force' | 'power'
  godView: string
  lifeView: string
}

export const HAWKINS_LEVELS: HawkinsLevel[] = [
  {
    level: 20,
    name: 'Shame',
    emotion: 'Humiliation',
    description: 'Nearly dead, miserable, can spread to destroy others',
    color: '#c0392b',
    bgColor: 'rgba(192,57,43,0.15)',
    power: 'force',
    godView: 'Despising',
    lifeView: 'Miserable',
  },
  {
    level: 30,
    name: 'Guilt',
    emotion: 'Blame',
    description: 'Victim of remorse, self-flagellation, masochism',
    color: '#c0392b',
    bgColor: 'rgba(192,57,43,0.15)',
    power: 'force',
    godView: 'Vindictive',
    lifeView: 'Evil',
  },
  {
    level: 50,
    name: 'Apathy',
    emotion: 'Despair',
    description: 'Poverty, hopelessness, resignation',
    color: '#8e44ad',
    bgColor: 'rgba(142,68,173,0.15)',
    power: 'force',
    godView: 'Uncaring',
    lifeView: 'Hopeless',
  },
  {
    level: 75,
    name: 'Grief',
    emotion: 'Regret',
    description: 'Loss, dependency, despondency, mourning',
    color: '#6c5ce7',
    bgColor: 'rgba(108,92,231,0.15)',
    power: 'force',
    godView: 'Disdainful',
    lifeView: 'Tragic',
  },
  {
    level: 100,
    name: 'Fear',
    emotion: 'Anxiety',
    description: 'Withdrawal, avoidance, defensiveness',
    color: '#e17055',
    bgColor: 'rgba(225,112,85,0.15)',
    power: 'force',
    godView: 'Punishing',
    lifeView: 'Frightening',
  },
  {
    level: 125,
    name: 'Desire',
    emotion: 'Craving',
    description: 'Insatiability, addiction, slavery to wants',
    color: '#d35400',
    bgColor: 'rgba(211,84,0,0.15)',
    power: 'force',
    godView: 'Denying',
    lifeView: 'Disappointing',
  },
  {
    level: 150,
    name: 'Anger',
    emotion: 'Hate',
    description: 'Resentment, revenge, hostile',
    color: '#e74c3c',
    bgColor: 'rgba(231,76,60,0.15)',
    power: 'force',
    godView: 'Vengeful',
    lifeView: 'Antagonistic',
  },
  {
    level: 175,
    name: 'Pride',
    emotion: 'Scorn',
    description: 'Demanding, inflation of ego, denial',
    color: '#f39c12',
    bgColor: 'rgba(243,156,18,0.15)',
    power: 'force',
    godView: 'Indifferent',
    lifeView: 'Demanding',
  },
  {
    level: 200,
    name: 'Courage',
    emotion: 'Affirmation',
    description: 'Empowerment — the critical point between force and power',
    color: '#d4a24c',
    bgColor: 'rgba(212,162,76,0.15)',
    power: 'power',
    godView: 'Enabling',
    lifeView: 'Feasible',
  },
  {
    level: 250,
    name: 'Neutrality',
    emotion: 'Trust',
    description: 'Release, non-attachment, flexible',
    color: '#d4a24c',
    bgColor: 'rgba(212,162,76,0.15)',
    power: 'power',
    godView: 'Enabling',
    lifeView: 'Satisfactory',
  },
  {
    level: 310,
    name: 'Willingness',
    emotion: 'Optimism',
    description: 'Intention, cheerfulness, aligned with life',
    color: '#00b894',
    bgColor: 'rgba(0,184,148,0.15)',
    power: 'power',
    godView: 'Inspiring',
    lifeView: 'Hopeful',
  },
  {
    level: 350,
    name: 'Acceptance',
    emotion: 'Forgiveness',
    description: 'Harmony, transcendence, transformation',
    color: '#00cec9',
    bgColor: 'rgba(0,206,201,0.15)',
    power: 'power',
    godView: 'Merciful',
    lifeView: 'Harmonious',
  },
  {
    level: 400,
    name: 'Reason',
    emotion: 'Understanding',
    description: 'Abstraction, objectivity, symbol processing',
    color: '#0984e3',
    bgColor: 'rgba(9,132,227,0.15)',
    power: 'power',
    godView: 'Wise',
    lifeView: 'Meaningful',
  },
  {
    level: 500,
    name: 'Love',
    emotion: 'Reverence',
    description: 'Revelation, benign, supportive',
    color: '#fd79a8',
    bgColor: 'rgba(253,121,168,0.15)',
    power: 'power',
    godView: 'Loving',
    lifeView: 'Benign',
  },
  {
    level: 540,
    name: 'Joy',
    emotion: 'Serenity',
    description: 'Compassion, seeing the beauty in all',
    color: '#fdcb6e',
    bgColor: 'rgba(253,203,110,0.15)',
    power: 'power',
    godView: 'Joyful',
    lifeView: 'Complete',
  },
  {
    level: 600,
    name: 'Peace',
    emotion: 'Bliss',
    description: 'Transfiguration, illumination, perfection',
    color: '#a29bfe',
    bgColor: 'rgba(162,155,254,0.15)',
    power: 'power',
    godView: 'All-being',
    lifeView: 'Perfect',
  },
  {
    level: 700,
    name: 'Enlightenment',
    emotion: 'Ineffable',
    description: 'Pure consciousness, non-duality, transcendence',
    color: '#e17fff',
    bgColor: 'rgba(225,127,255,0.15)',
    power: 'power',
    godView: 'Is',
    lifeView: 'Is',
  },
]

export function getLevelForScore(score: number): HawkinsLevel {
  // Find the closest level
  let closest = HAWKINS_LEVELS[0]
  let minDiff = Math.abs(score - HAWKINS_LEVELS[0].level)
  for (const lvl of HAWKINS_LEVELS) {
    const diff = Math.abs(score - lvl.level)
    if (diff < minDiff) {
      minDiff = diff
      closest = lvl
    }
  }
  return closest
}

export function getLevelPercent(score: number): number {
  // Map 20–700 to 0–100%
  const min = 20
  const max = 700
  return Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100))
}

export const CALIBRATION_EMOTIONS = [
  'Anxious', 'Overwhelmed', 'Angry', 'Fearful', 'Stuck', 'Hopeless',
  'Frustrated', 'Sad', 'Numb', 'Restless', 'Uncertain', 'Tired',
  'Neutral', 'Okay', 'Calm', 'Curious', 'Content', 'Motivated',
  'Grateful', 'Hopeful', 'Joyful', 'Loving', 'Peaceful', 'Inspired',
]
