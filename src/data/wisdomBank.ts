import type { Wisdom } from '../types'

// Wisdom blocks (myth / fable / philosophy / stoic) tiered by Hawkins calibration range,
// and tagged by emotional theme. Used by the local "Lite" analysis engine.

export type WisdomTier = 'low' | 'mid' | 'high'
export type WisdomTheme = 'avoidance' | 'fear' | 'anger' | 'overwhelm' | 'sadness' | 'growth' | 'general'

export interface WisdomEntry extends Wisdom {
  themes: WisdomTheme[]
}

// LOW tier — calibration below ~200 (Courage). Force-based states: fear, anger, grief, shame, desire.
const LOW_TIER: WisdomEntry[] = [
  {
    themes: ['avoidance', 'general'],
    myth: {
      title: 'Sisyphus and the Boulder',
      story:
        'Sisyphus is condemned to push a boulder up a hill for eternity, only to watch it roll back down each time he nears the top. Albert Camus later reframed this not as pure punishment, but as a mirror for the human condition — and found a strange freedom in the choice to push anyway.',
      parallel:
        'Whatever feels heavy and unending right now can feel like Sisyphus\'s boulder — too big, too repetitive, never finished. The myth\'s quiet twist is that meaning was never in finishing the climb forever; it was in how Sisyphus met *this* push, *this* moment.',
    },
    fable: {
      title: 'The Tortoise and the Hare',
      lesson:
        'The hare bursts ahead on raw motivation, then naps and loses everything. The tortoise, slow and unremarkable, keeps moving and wins. The lesson isn\'t really about speed — it\'s that small, steady motion outlasts big bursts of intensity, especially for things you\'ve been avoiding.',
    },
    philosophy: {
      source: 'Stoicism (Marcus Aurelius, Meditations)',
      quote: '"You have power over your mind — not outside events. Realize this, and you will find strength."',
      application:
        'The full scope of what\'s in front of you may genuinely be out of your hands right now. But the next small action — the next ten minutes — is fully yours. Stoic practice doesn\'t start with the mountain; it starts with the next handhold.',
    },
    stoic:
      'Today, pick the smallest possible piece of what you\'ve been avoiding — five minutes, one sentence, one click — and do only that. Momentum is built, not found waiting.',
  },
  {
    themes: ['anger', 'general'],
    myth: {
      title: 'Prometheus Bound',
      story:
        'Prometheus steals fire from the gods to give it to humanity, and is punished by being chained to a rock. The fire he stole — passion, defiance, the refusal to accept a given order — is the same fire that burns as anger when it has nowhere to go.',
      parallel:
        'Anger is often fire that was meant to create something — a boundary, a change, a piece of art — but has been chained up instead. The myth doesn\'t condemn the fire; it asks what it was *for*.',
    },
    fable: {
      title: 'The North Wind and the Sun',
      lesson:
        'The Wind and the Sun compete to make a traveler remove his cloak. The Wind blasts furiously and the traveler only clutches the cloak tighter; the Sun simply warms, and the cloak comes off on its own. Force often produces resistance; warmth produces release.',
    },
    philosophy: {
      source: 'Stoicism (Seneca, On Anger)',
      quote: '"The greatest remedy for anger is delay."',
      application:
        'Seneca\'s point wasn\'t to suppress anger — it was that anger\'s first verdict is rarely its best one. A short pause between the spark and the response gives the same fire a chance to become useful rather than destructive.',
    },
    stoic:
      'Next time you notice the heat of anger rising, name it out loud — "this is anger" — and wait three breaths before doing anything else. Naming creates a sliver of space between the feeling and the reaction.',
  },
  {
    themes: ['fear', 'overwhelm', 'sadness', 'general'],
    myth: {
      title: 'Theseus and the Labyrinth',
      story:
        'Theseus enters the labyrinth to face the Minotaur, but only survives by unspooling a thread from Ariadne as he goes — a way back, a way through. The monster was real, but so was the thread.',
      parallel:
        'Whatever maze you\'re in right now can feel like it has no exit because you can\'t see the whole shape of it at once. You don\'t need to see the whole labyrinth — just the next length of thread.',
    },
    fable: {
      title: 'The Oak and the Reed',
      lesson:
        'A mighty oak boasts of its strength to a slender reed bending in the wind. When the storm comes, the rigid oak is uprooted, while the reed — bending again and again — survives. Sometimes the strongest response is the one that bends.',
    },
    philosophy: {
      source: 'Stoicism (Epictetus, Discourses)',
      quote: '"It\'s not what happens to you, but how you react to it that matters."',
      application:
        'Epictetus drew a hard line between what is "up to us" and what is not. Sorting your current situation into these two piles — even imperfectly — can take some of the charge out of the parts that were never within your control to begin with.',
    },
    stoic:
      'Write down the situation in one sentence. Underneath it, list only the parts that are actually within your control. Even a short list shrinks the felt size of the problem.',
  },
]

// MID tier — calibration roughly 200-349 (Courage through Acceptance). Transitional power states.
const MID_TIER: WisdomEntry[] = [
  {
    themes: ['growth', 'general', 'avoidance'],
    myth: {
      title: 'The Phoenix',
      story:
        'The phoenix does not merely survive its ending — it builds the fire itself, then rises renewed from the ashes. The ending and the beginning are not two separate events; they are the same event, seen from two sides.',
      parallel:
        'A transition you\'re moving through may look like loss from one angle and like preparation from another. The phoenix doesn\'t fight the fire — it uses it.',
    },
    fable: {
      title: 'The Acorn and the Oak',
      lesson:
        'An acorn, buried and forgotten, seems like nothing at all — until, slowly and invisibly, it becomes an oak. The fable reminds us that the most important growth often happens underground, before there\'s anything to show for it.',
    },
    philosophy: {
      source: 'Stoicism (Marcus Aurelius, Meditations)',
      quote: '"The impediment to action advances action. What stands in the way becomes the way."',
      application:
        'What feels like an obstacle to your plan may, on closer look, be revealing the actual next plan. Marcus Aurelius treated obstacles as raw material, not detours — the thing in front of you is now part of the path, not separate from it.',
    },
    stoic:
      'Identify one obstacle currently in your way. Write one sentence describing how dealing with it directly — rather than around it — could become part of your progress, not a delay to it.',
  },
  {
    themes: ['anger', 'sadness', 'general'],
    myth: {
      title: 'Demeter and the Seasons',
      story:
        'When Demeter\'s daughter Persephone is taken to the underworld, Demeter\'s grief is so total that the earth goes barren — winter is born from her mourning. But the story doesn\'t end there: spring returns, every year, because grief and renewal are written into the same cycle.',
      parallel:
        'Heavy feelings aren\'t a malfunction in the cycle — they often *are* the cycle, mid-turn. Winter is not a failure of spring; it\'s the season before it.',
    },
    fable: {
      title: 'The Two Wolves',
      lesson:
        'An elder tells a child that two wolves live inside every person — one of anger and fear, one of peace and understanding — and they are always fighting. Asked which wins, the elder answers: "The one you feed."',
    },
    philosophy: {
      source: 'Stoicism (Epictetus, Discourses)',
      quote: '"No person is free who is not master of themselves."',
      application:
        'Mastery here doesn\'t mean suppressing the wolf of anger or fear — it means choosing, repeatedly, which one gets your attention, your time, your words. Freedom is in the choosing, not in never having both wolves.',
    },
    stoic:
      'Notice one moment today where you have a choice between feeding the reactive wolf and the steady one — and feed the steady one, even slightly, even imperfectly.',
  },
  {
    themes: ['fear', 'overwhelm', 'general'],
    myth: {
      title: 'Icarus and the Wax Wings',
      story:
        'Icarus is given wings of feathers and wax and warned not to fly too close to the sun. He flies anyway, the wax melts, and he falls. The story is often told as a warning against ambition — but it\'s also a story about a person who, for one glorious stretch, actually flew.',
      parallel:
        'Fear of "flying too close" can quietly become fear of flying at all. The myth\'s warning was about the wax, not about the flight itself.',
    },
    fable: {
      title: 'The Crow and the Pitcher',
      lesson:
        'A thirsty crow finds a pitcher with water too low to reach. Rather than give up, it drops pebbles in one by one until the water rises enough to drink. No single pebble does much — but the crow keeps dropping them anyway.',
    },
    philosophy: {
      source: 'Stoicism (Seneca, Letters from a Stoic)',
      quote: '"We suffer more in imagination than in reality."',
      application:
        'Seneca observed that the mind often rehearses disasters that never arrive, paying a cost in advance for events that may never happen. Separating "what is happening" from "what I\'m imagining might happen" can return a surprising amount of energy.',
    },
    stoic:
      'Write down what is actually, factually true about your situation right now — only what you can verify. Then separately note what you\'re imagining or predicting. Notice the size difference between the two lists.',
  },
]

// HIGH tier — calibration 350+ (Acceptance through Enlightenment). Power-based states.
const HIGH_TIER: WisdomEntry[] = [
  {
    themes: ['growth', 'general'],
    myth: {
      title: 'Indra\'s Net',
      story:
        'In this image from Buddhist and Hindu cosmology, the universe is a vast net, and at each knot hangs a jewel that reflects every other jewel in the net — infinitely, perfectly. Nothing exists separately; everything is a reflection of everything else.',
      parallel:
        'A moment of clarity or ease rarely belongs only to you — it ripples outward, reflected in how you show up for others, and reflects back what they\'ve given you too.',
    },
    fable: {
      title: 'The Empty Boat',
      lesson:
        'A boatman, furious at another boat for ramming his, discovers as it drifts closer that it is empty — no one to blame, no one to be angry at. The Taoist lesson: much of our reactivity assumes an intention that may not even be there.',
    },
    philosophy: {
      source: 'Stoicism (Marcus Aurelius, Meditations)',
      quote: '"Confine yourself to the present."',
      application:
        'From a place of relative ease, the temptation is to start planning, securing, or extending the feeling forward and backward in time. Marcus Aurelius\'s instruction is almost playful here: don\'t export this moment anywhere. Let it be exactly as large as now.',
    },
    stoic:
      'Spend two minutes doing absolutely nothing but noticing what is good, true, or working right now — without turning it into a plan for tomorrow.',
  },
  {
    themes: ['general', 'sadness', 'fear'],
    myth: {
      title: 'The Bodhisattva\'s Vow',
      story:
        'In Mahayana Buddhism, a bodhisattva is someone who, having reached the doorway of liberation, turns back toward the world to help others find their way too. Arrival isn\'t the end of the story — it changes what you do next.',
      parallel:
        'Whatever clarity or peace you\'ve found doesn\'t have to be hoarded or protected — it can become something you offer, which often deepens it rather than depleting it.',
    },
    fable: {
      title: 'The River That Reached the Desert',
      lesson:
        'A river, flowing confidently, hits a desert and starts to evaporate trying to cross it the same way it always has. The wind tells it: let yourself be carried as vapor, and you\'ll fall as rain on the other side. Sometimes reaching the next stage means changing form, not pushing harder.',
    },
    philosophy: {
      source: 'Taoism (Tao Te Ching)',
      quote: '"Nature does not hurry, yet everything is accomplished."',
      application:
        'In states of ease, there can be a subtle pull to "make the most of it" — to optimize the calm itself. The Taoist counter is trust: things are unfolding, including you, without needing to be managed every second.',
    },
    stoic:
      'Choose one thing today that you would normally rush, and do it at exactly half your usual pace. Notice what — if anything — was actually lost.',
  },
  {
    themes: ['avoidance', 'anger', 'general'],
    myth: {
      title: 'The Net of Vulcan',
      story:
        'In one telling, the smith-god Vulcan crafts a net so fine it is invisible, used to catch those who think themselves unseen. Read differently, the net is consciousness itself — nothing stays hidden from a clear enough awareness, including from your own.',
      parallel:
        'From a place of clarity, old patterns of avoidance or reactivity become visible in a way they weren\'t before — not as failures, but as things finally lit well enough to see.',
    },
    fable: {
      title: 'The Mountain and the Squirrel',
      lesson:
        'A mountain mocks a squirrel for being small; the squirrel replies that while it cannot carry forests on its back, the mountain cannot crack a nut. Different scales of capability aren\'t a hierarchy — they\'re a set of tools, each suited to different work.',
    },
    philosophy: {
      source: 'Stoicism (Epictetus, Discourses)',
      quote: '"Wealth consists not in having great possessions, but in having few wants."',
      application:
        'From a place of relative peace, it becomes easier to notice how much of what used to feel urgent was actually optional. This isn\'t about wanting less out of denial — it\'s a side effect of already having enough attention for what matters.',
    },
    stoic:
      'List three things you currently treat as "musts." For each, ask honestly: is this a true necessity, or a want wearing a necessity\'s clothes?',
  },
]

export const WISDOM_BANK: Record<WisdomTier, WisdomEntry[]> = {
  low: LOW_TIER,
  mid: MID_TIER,
  high: HIGH_TIER,
}

export function getWisdomTier(hawkinsLevel: number): WisdomTier {
  if (hawkinsLevel < 200) return 'low'
  if (hawkinsLevel < 350) return 'mid'
  return 'high'
}
