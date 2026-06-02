import type { SavedWord } from '../types'

function levelColor(level: number): string {
  if (level < 100) return '#c0392b'
  if (level < 200) return '#e67e22'
  if (level < 310) return '#d4a24c'
  if (level < 500) return '#27ae60'
  return '#8e44ad'
}

function toneStyle(tone: string): string {
  const map: Record<string, string> = {
    warrior:    'background:#3d1515;color:#e88080;border:1px solid #6b2020',
    gentle:     'background:#153d20;color:#80e898;border:1px solid #206b30',
    playful:    'background:#2d1545;color:#c080e8;border:1px solid #5020a0',
    mythic:     'background:#3d2a10;color:#e8c080;border:1px solid #8a6020',
    scientific: 'background:#102d3d;color:#80c4e8;border:1px solid #206080',
  }
  return map[tone] ?? map.mythic
}

export function exportLexiconToPdf(words: SavedWord[]): void {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const tones = [...new Set(words.map(w => w.tone))].sort()
  const avgLevel = Math.round(words.reduce((a, b) => a + b.hawkinsLevel, 0) / words.length)

  const wordsHtml = words.map(w => {
    const color = levelColor(w.hawkinsLevel)
    const ts = toneStyle(w.tone)
    return `
    <div class="word-card">
      <div class="word-header">
        <div class="word-left">
          <span class="word-name">${w.word}</span>
          <span class="tone-badge" style="${ts}">${w.tone}</span>
        </div>
        <div class="word-meta">
          <span class="level-dot" style="background:${color}"></span>
          <span class="level-text" style="color:${color}">Lv. ${w.hawkinsLevel}</span>
          <span class="source-emotion">${w.sourceEmotion}</span>
        </div>
      </div>
      <p class="word-def">${w.definition}</p>
      ${w.mantra ? `
        <div class="mantra-row">
          <span class="mantra-label">Mantra</span>
          <span class="mantra-text">"${w.mantra}"</span>
        </div>
      ` : ''}
      <div class="word-date">${new Date(w.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
    </div>
  `}).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WordWise — Lexicon of Power</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0908;
      color: #f5f0e8;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { max-width: 780px; margin: 0 auto; padding: 48px 48px 64px; }

    /* Header */
    .header {
      display: flex; align-items: flex-start; justify-content: space-between;
      border-bottom: 1px solid #2e2824; padding-bottom: 28px; margin-bottom: 36px;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-icon { font-size: 36px; }
    .brand-name {
      font-family: 'Playfair Display', serif; font-size: 22px;
      background: linear-gradient(135deg, #d4a24c, #f0d080);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .brand-tagline { font-size: 9px; color: #8a8070; text-transform: uppercase; letter-spacing: .12em; margin-top: 2px; }
    .header-right { text-align: right; }
    .header-title { font-family: 'Playfair Display', serif; font-size: 24px; color: #f5f0e8; }
    .header-date { font-size: 11px; color: #8a8070; margin-top: 4px; }

    /* Stats */
    .stats-row {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 36px;
    }
    .stat {
      background: #1e1a17; border: 1px solid #2e2824; border-radius: 12px;
      padding: 14px 16px; text-align: center;
    }
    .stat-value { font-size: 26px; font-weight: 700; color: #d4a24c; }
    .stat-label { font-size: 10px; color: #8a8070; text-transform: uppercase; letter-spacing: .08em; margin-top: 4px; }

    /* Words */
    .section-title {
      font-family: 'Playfair Display', serif; font-size: 18px; color: #f5f0e8;
      margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
    }
    .section-title::after { content: ''; flex: 1; height: 1px; background: #2e2824; }

    .word-card {
      background: linear-gradient(135deg, #1e1a17, #141210);
      border: 1px solid #2e2824; border-radius: 14px;
      padding: 18px 20px; margin-bottom: 12px;
      break-inside: avoid;
    }
    .word-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px; margin-bottom: 10px;
    }
    .word-left { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
    .word-name {
      font-family: 'Playfair Display', serif; font-size: 22px; color: #d4a24c;
    }
    .tone-badge {
      font-size: 10px; padding: 3px 9px; border-radius: 20px; font-weight: 500;
    }
    .word-meta { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .level-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .level-text { font-size: 11px; font-weight: 600; }
    .source-emotion { font-size: 10px; color: #8a8070; font-style: italic; }
    .word-def { font-size: 13px; color: #c8bfb0; line-height: 1.65; margin-bottom: 10px; }
    .mantra-row {
      background: #0e0c0a; border-radius: 10px; padding: 10px 14px;
      display: flex; gap: 10px; align-items: baseline; margin-bottom: 8px;
    }
    .mantra-label { font-size: 9px; color: #8a8070; text-transform: uppercase; letter-spacing: .1em; flex-shrink: 0; }
    .mantra-text { font-family: 'Playfair Display', serif; font-size: 13px; color: #d4a24c; font-style: italic; }
    .word-date { font-size: 10px; color: #5a5050; text-align: right; }

    /* Footer */
    .footer {
      border-top: 1px solid #2e2824; margin-top: 48px; padding-top: 20px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .footer-brand { font-family: 'Playfair Display', serif; font-size: 13px; color: #5a5050; }
    .footer-tagline { font-size: 10px; color: #3d3530; font-style: italic; margin-top: 3px; }
    .footer-count { font-size: 10px; color: #5a5050; text-align: right; }

    @media print {
      body { background: #0a0908 !important; }
      .page { padding: 32px 40px 48px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        <div class="brand-icon">🌳</div>
        <div>
          <div class="brand-name">WordWise</div>
          <div class="brand-tagline">Personal Lexicon of Power</div>
        </div>
      </div>
      <div class="header-right">
        <div class="header-title">Lexicon of Power</div>
        <div class="header-date">Exported ${date}</div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat">
        <div class="stat-value">${words.length}</div>
        <div class="stat-label">Words Forged</div>
      </div>
      <div class="stat">
        <div class="stat-value">${tones.length}</div>
        <div class="stat-label">Tones</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color:${levelColor(avgLevel)}">${avgLevel}</div>
        <div class="stat-label">Avg. Level</div>
      </div>
      <div class="stat">
        <div class="stat-value">${words.filter(w => w.hawkinsLevel >= 200).length}</div>
        <div class="stat-label">Power Words</div>
      </div>
    </div>

    <div class="section-title">✦ Your Forged Words</div>
    ${wordsHtml}

    <div class="footer">
      <div>
        <div class="footer-brand">🌳 WordWise</div>
        <div class="footer-tagline">"Forge the words to become who you're meant to be."</div>
      </div>
      <div class="footer-count">${words.length} word${words.length !== 1 ? 's' : ''} in your lexicon</div>
    </div>
  </div>
  <script>
    window.addEventListener('load', () => setTimeout(() => window.print(), 400))
  </script>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) win.addEventListener('afterprint', () => URL.revokeObjectURL(url))
}
