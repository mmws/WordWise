import type { Analysis } from '../types'

function levelColor(level: number): string {
  if (level < 100) return '#c0392b'
  if (level < 200) return '#e67e22'
  if (level < 310) return '#d4a24c'
  if (level < 500) return '#27ae60'
  return '#8e44ad'
}

function toneColor(tone: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    warrior:    { bg: '#3d1515', text: '#e88080', border: '#6b2020' },
    gentle:     { bg: '#153d20', text: '#80e898', border: '#206b30' },
    playful:    { bg: '#2d1545', text: '#c080e8', border: '#5020a0' },
    mythic:     { bg: '#3d2a10', text: '#e8c080', border: '#8a6020' },
    scientific: { bg: '#102d3d', text: '#80c4e8', border: '#206080' },
  }
  return map[tone] ?? map.mythic
}

export function exportAnalysisToPdf(analysis: Analysis): void {
  const a = analysis
  const color = levelColor(a.hawkinsLevel)
  const date = new Date(a.timestamp).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const etymologyHtml = a.etymology.map(e => `
    <div class="card etymology-card">
      <div class="card-header">
        <span class="word-title">${e.word}</span>
        <span class="tag">${e.language}</span>
      </div>
      <div class="grid-2">
        <div class="mini-card">
          <div class="mini-label">Root</div>
          <div class="mini-value">${e.root}</div>
        </div>
        <div class="mini-card">
          <div class="mini-label">Originally meant</div>
          <div class="mini-value">${e.originalMeaning}</div>
        </div>
      </div>
      <div class="section-label">Insight</div>
      <p class="body-text">${e.insight}</p>
      ${e.wordShadow ? `
        <div class="shadow-section">
          <div class="section-label shadow-label">🌑 Word Shadow</div>
          <p class="body-text muted italic">${e.wordShadow}</p>
        </div>
      ` : ''}
    </div>
  `).join('')

  const neologismsHtml = a.neologisms.map(n => {
    const tc = toneColor(n.tone)
    return `
    <div class="card neo-card">
      <div class="card-header">
        <span class="neo-title">${n.word}</span>
        <div class="tag-group">
          <span class="tag tone-tag" style="background:${tc.bg};color:${tc.text};border-color:${tc.border}">${n.tone}</span>
          <span class="tag type-tag">${n.type}</span>
        </div>
      </div>
      <p class="body-text">${n.definition}</p>
    </div>
  `}).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>WordWise — ${a.dominantEmotion} — ${date}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #0a0908;
      color: #f5f0e8;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      max-width: 780px;
      margin: 0 auto;
      padding: 48px 48px 64px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid #2e2824;
      padding-bottom: 28px;
      margin-bottom: 36px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon { font-size: 36px; line-height: 1; }
    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      background: linear-gradient(135deg, #d4a24c, #f0d080);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .brand-tagline {
      font-size: 9px;
      color: #8a8070;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-top: 2px;
    }
    .header-meta {
      text-align: right;
    }
    .header-date { font-size: 11px; color: #8a8070; margin-bottom: 6px; }
    .header-emotion {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      color: #f5f0e8;
      text-transform: capitalize;
    }

    /* ── Calibration banner ── */
    .calibration-banner {
      border-radius: 14px;
      border: 1px solid ${color}40;
      background: ${color}15;
      padding: 20px 24px;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .cal-level {
      font-size: 48px;
      font-weight: 700;
      color: ${color};
      line-height: 1;
      min-width: 80px;
    }
    .cal-info { flex: 1; }
    .cal-name {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      color: ${color};
      margin-bottom: 4px;
    }
    .cal-desc { font-size: 12px; color: #c8bfb0; line-height: 1.5; }
    .cal-bar-wrap {
      height: 8px;
      background: #2e2824;
      border-radius: 4px;
      margin-top: 10px;
      overflow: hidden;
    }
    .cal-bar {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(to right, #4a0000, #8B3A00, #C47A00, #d4a24c, #8BAF7A, #5A9B8A, #4A8B9B, #AA7BAB);
      width: 100%;
    }
    .cal-bar-fill {
      height: 100%;
      background: ${color};
      border-radius: 4px;
      width: ${Math.max(2, ((a.hawkinsLevel - 20) / 680) * 100)}%;
    }
    .power-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
      ${a.hawkinsLevel >= 200
        ? 'background: rgba(0,184,148,0.15); color: #00b894; border: 1px solid rgba(0,184,148,0.3);'
        : 'background: rgba(192,57,43,0.15); color: #e74c3c; border: 1px solid rgba(192,57,43,0.3);'
      }
    }

    /* ── Section titles ── */
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      color: #f5f0e8;
      margin-bottom: 14px;
      margin-top: 36px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #2e2824;
    }

    /* ── Cards ── */
    .card {
      background: linear-gradient(135deg, #1e1a17, #141210);
      border: 1px solid #2e2824;
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 14px;
    }
    .card-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }
    .word-title {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      color: #d4a24c;
    }
    .neo-title {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #d4a24c;
    }
    .tag {
      font-size: 10px;
      padding: 3px 9px;
      border-radius: 20px;
      background: #2e2824;
      color: #8a8070;
      border: 1px solid #3d3530;
      white-space: nowrap;
    }
    .tag-group { display: flex; gap: 6px; }
    .tone-tag { border: 1px solid; }
    .type-tag { background: #1e1a17; color: #8a8070; }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
    }
    .mini-card {
      background: #0e0c0a;
      border-radius: 10px;
      padding: 10px 14px;
    }
    .mini-label { font-size: 10px; color: #8a8070; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .mini-value { font-size: 13px; color: #f5f0e8; font-weight: 500; font-style: italic; }

    .section-label {
      font-size: 10px;
      color: #8a8070;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 6px;
    }
    .shadow-section {
      border-top: 1px solid #2e2824;
      padding-top: 12px;
      margin-top: 12px;
    }
    .shadow-label { color: #5a5050; }

    .body-text { font-size: 13px; color: #c8bfb0; line-height: 1.65; }
    .muted { color: #8a8070; }
    .italic { font-style: italic; }

    /* ── Insight / Reframe ── */
    .insight-card {
      background: #141210;
      border: 1px solid #2e2824;
      border-radius: 14px;
      padding: 18px 22px;
      margin-bottom: 14px;
    }
    .insight-icon { font-size: 16px; margin-right: 8px; }

    /* ── Mantra ── */
    .mantra-card {
      background: linear-gradient(135deg, #1e1a17, #141210);
      border: 1px solid ${color}30;
      border-radius: 14px;
      padding: 24px;
      text-align: center;
      margin-bottom: 28px;
      box-shadow: 0 0 30px ${color}10;
    }
    .mantra-label {
      font-size: 10px;
      color: #8a8070;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      margin-bottom: 12px;
    }
    .mantra-text {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      color: #d4a24c;
      font-style: italic;
      line-height: 1.5;
    }

    /* ── Wisdom ── */
    .wisdom-card {
      background: linear-gradient(135deg, #1e1a17, #141210);
      border: 1px solid #2e2824;
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 14px;
    }
    .wisdom-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }
    .wisdom-icon { font-size: 20px; line-height: 1.2; }
    .wisdom-source-label { font-size: 10px; color: #8a8070; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
    .wisdom-source-name {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      color: #f5f0e8;
    }
    blockquote {
      border-left: 2px solid #d4a24c;
      padding-left: 14px;
      margin: 10px 0;
      font-size: 13px;
      color: #c8bfb0;
      font-style: italic;
      line-height: 1.65;
    }
    .parallel-label {
      font-size: 10px;
      color: #d4a24c;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 12px;
      margin-bottom: 4px;
    }

    /* ── Footer ── */
    .footer {
      border-top: 1px solid #2e2824;
      margin-top: 48px;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-brand {
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      color: #5a5050;
    }
    .footer-tagline { font-size: 10px; color: #3d3530; font-style: italic; margin-top: 3px; }
    .footer-date { font-size: 10px; color: #5a5050; text-align: right; }

    /* ── Print ── */
    @media print {
      body { background: #0a0908 !important; }
      .page { padding: 32px 40px 48px; }
      .section-title { margin-top: 28px; }
      .card, .insight-card, .mantra-card, .wisdom-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-icon">🌳</div>
        <div>
          <div class="brand-name">WordWise</div>
          <div class="brand-tagline">Forge the Words to Become Who You're Meant to Be</div>
        </div>
      </div>
      <div class="header-meta">
        <div class="header-date">${date}</div>
        <div class="header-emotion">${a.dominantEmotion}</div>
      </div>
    </div>

    <!-- Calibration -->
    <div class="calibration-banner">
      <div class="cal-level">${a.hawkinsLevel}</div>
      <div class="cal-info">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <div class="cal-name">${a.hawkinsName}</div>
          <div class="power-badge">${a.hawkinsLevel >= 200 ? '⚡ Power' : '🔗 Force'}</div>
        </div>
        <div class="cal-bar-wrap">
          <div class="cal-bar-fill"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:5px;">
          <span style="font-size:9px;color:#5a5050">Shame 20</span>
          <span style="font-size:9px;color:#d4a24c">Courage 200</span>
          <span style="font-size:9px;color:#5a5050">Enlightenment 700</span>
        </div>
      </div>
    </div>

    <!-- Root Insight -->
    <div class="insight-card">
      <div class="section-label"><span class="insight-icon">🔍</span>Root Insight</div>
      <p class="body-text">${a.rootInsight}</p>
    </div>

    <!-- Reframe -->
    <div class="insight-card">
      <div class="section-label"><span class="insight-icon">🔄</span>Reframe</div>
      <p class="body-text">${a.reframe}</p>
    </div>

    <!-- Mantra -->
    <div class="mantra-card">
      <div class="mantra-label">Your Mantra</div>
      <div class="mantra-text">"${a.mantra}"</div>
    </div>

    <!-- Etymology -->
    <div class="section-title">🌱 Etymology — The Roots</div>
    ${etymologyHtml}

    <!-- Neologisms -->
    <div class="section-title">✦ Forged Words — Your Remedy</div>
    ${neologismsHtml}

    <!-- Wisdom -->
    <div class="section-title">📜 Wisdom</div>

    <div class="wisdom-card">
      <div class="wisdom-header">
        <div class="wisdom-icon">🏛</div>
        <div>
          <div class="wisdom-source-label">Mythological Mirror</div>
          <div class="wisdom-source-name">${a.wisdom.myth.title}</div>
        </div>
      </div>
      <p class="body-text">${a.wisdom.myth.story}</p>
      <div class="parallel-label">Your parallel</div>
      <p class="body-text italic muted">${a.wisdom.myth.parallel}</p>
    </div>

    <div class="wisdom-card">
      <div class="wisdom-header">
        <div class="wisdom-icon">🦊</div>
        <div>
          <div class="wisdom-source-label">Fable</div>
          <div class="wisdom-source-name">${a.wisdom.fable.title}</div>
        </div>
      </div>
      <p class="body-text">${a.wisdom.fable.lesson}</p>
    </div>

    <div class="wisdom-card">
      <div class="wisdom-header">
        <div class="wisdom-icon">🔭</div>
        <div>
          <div class="wisdom-source-label">Philosophy</div>
          <div class="wisdom-source-name">${a.wisdom.philosophy.source}</div>
        </div>
      </div>
      <blockquote>"${a.wisdom.philosophy.quote}"</blockquote>
      <p class="body-text">${a.wisdom.philosophy.application}</p>
    </div>

    <div class="wisdom-card">
      <div class="wisdom-header">
        <div class="wisdom-icon">⚡</div>
        <div>
          <div class="wisdom-source-label">Stoic Micro-Lesson</div>
        </div>
      </div>
      <p class="body-text">${a.wisdom.stoic}</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>
        <div class="footer-brand">🌳 WordWise</div>
        <div class="footer-tagline">"Understand the roots of how you feel."</div>
      </div>
      <div class="footer-date">
        Generated ${new Date(a.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br/>
        Level ${a.hawkinsLevel} · ${a.hawkinsName}
      </div>
    </div>

  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => window.print(), 400)
    })
  </script>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) {
    win.addEventListener('afterprint', () => URL.revokeObjectURL(url))
  }
}
