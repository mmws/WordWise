# WordWise — Setup Guide

> "Understand the roots of how you feel. Forge the words to become who you're meant to be."

## Quick Start

### 1. Install dependencies
```bash
cd WordWise
npm install
```

### 2. Add your API key
```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

Or skip this — you can add the key inside the app under **Settings**.

Get an API key at: https://console.anthropic.com

### 3. Run
```bash
npm run dev
```

Open http://localhost:5173

---

## What You Get

- **Daily Check-In** — Describe what's alive in your world, calibrate your state on the Hawkins scale
- **Etymology Analysis** — Deep roots of the words you used, revealing hidden assumptions
- **Hawkins Calibration** — Maps your state to the Map of Consciousness (Power vs. Force)
- **Neologism Generation** — Claude creates 3 new words tailored to your shift
- **Mantras** — Rhythmic, memorable phrases to install new patterns
- **Wisdom Library** — Matched myths, fables, and philosophy
- **Lexicon of Power** — Save and collect your forged words
- **Progress Tracking** — Visualize your consciousness curve over time

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Recharts (progress charts)
- Claude claude-opus-4-6 (via Anthropic API)

## Cost

Each analysis uses ~1,500–2,000 tokens. With claude-opus-4-6:
- ~$0.015–0.030 per check-in
- A month of daily check-ins ≈ $0.50–$1.00

## Build for Production

```bash
npm run build
npm run preview
```
