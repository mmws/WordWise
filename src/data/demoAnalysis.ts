import type { Analysis } from '../types'

// A pre-written sample analysis so people can see what WordWise produces
// before they add their own Anthropic API key.
export const DEMO_ANALYSIS: Analysis = {
  id: 'demo',
  timestamp: Date.now(),
  userInput: "I keep putting things off and I don't know why.",
  dominantEmotion: 'Avoidance',
  hawkinsLevel: 125,
  hawkinsName: 'Desire',
  hawkinsRange: [125, 150],
  rootInsight:
    "Your language frames the task as something happening to you from a distance — 'I keep putting things off' positions the delay as a recurring event rather than a choice made in this moment. The repetition ('keep') suggests a pattern you've noticed but haven't yet named as a decision point.",
  reframe:
    "What if procrastination isn't a flaw to fix, but a signal pointing at something — fear of the work not being good enough, or unclear next steps? Try: 'I haven't started yet, and I get to choose the next ten minutes.'",
  etymology: [
    {
      word: 'Procrastinate',
      root: 'Latin: pro (forward) + crastinus (of tomorrow)',
      language: 'Latin',
      originalMeaning: 'To push something forward, onto tomorrow',
      insight:
        "The word itself describes a small act of time-travel — every time you 'procrastinate,' you're literally relocating a task into a future that doesn't yet exist.",
      wordShadow:
        "Modern usage makes 'procrastinate' sound like a character flaw ('I'm such a procrastinator'), when its root just describes a single, reversible action: moving something to tomorrow.",
    },
    {
      word: 'Avoid',
      root: 'Old French: evuider — to empty out, clear away',
      language: 'Old French / Latin',
      originalMeaning: 'To make empty, to clear a space',
      insight:
        "Avoidance was originally about clearing space — there's a hidden logic of self-protection in it, not just weakness. The question becomes: space for what?",
      wordShadow:
        "Today 'avoidance' is almost always framed negatively, obscuring that it can be a (clumsy) attempt to protect bandwidth, energy, or self-image.",
    },
  ],
  neologisms: [
    {
      word: 'Nowward',
      definition: 'Oriented toward the present moment as a direction of motion, not just a point in time.',
      type: 'adjective',
      tone: 'warrior',
    },
    {
      word: 'Presentify',
      definition: 'To take a vague future task and translate it into one concrete action available right now.',
      type: 'verb',
      tone: 'scientific',
    },
    {
      word: 'Momentforge',
      definition: 'The small workshop of the present moment, where intentions are hammered into action.',
      type: 'compound',
      tone: 'mythic',
    },
  ],
  mantra: 'I move Nowward — I Presentify one step, and let the Momentforge do its work.',
  wisdom: {
    myth: {
      title: 'Sisyphus and the Boulder',
      story:
        "Sisyphus is condemned to push a boulder up a hill for eternity, only to watch it roll back down. Camus reframed this not as punishment but as the human condition — and found freedom in choosing to push anyway.",
      parallel:
        "The task you're avoiding can feel like Sisyphus's boulder — eternal, unwinnable. But the myth's twist is that meaning comes from the choice to push *this* moment, not from finishing forever.",
    },
    fable: {
      title: 'The Tortoise and the Hare',
      lesson:
        "The hare's burst of motivation collapses into a nap; the tortoise's small, steady steps win. The lesson isn't about speed — it's that consistency beats intensity, especially for tasks that trigger avoidance.",
    },
    philosophy: {
      source: 'Stoicism (Marcus Aurelius)',
      quote: '"You have power over your mind — not outside events. Realize this, and you will find strength."',
      application:
        "The task itself may feel heavy and out of your control, but the next ten minutes are entirely yours. Stoic practice starts there: not with the whole mountain, but with the next handhold.",
    },
    stoic:
      'Today, pick the smallest possible piece of the thing you\'re avoiding — five minutes, one sentence, one click — and do only that. Momentum is built, not found.',
  },
}
