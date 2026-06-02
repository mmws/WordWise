import type { Analysis, SavedWord } from '../types'

function levelColor(level: number): string {
  if (level < 100) return '#c0392b'
  if (level < 200) return '#e67e22'
  if (level < 310) return '#d4a24c'
  if (level < 500) return '#27ae60'
  return '#8e44ad'
}

function levelName(level: number): string {
  const names: [number, string][] = [
    [20,'Shame'],[30,'Guilt'],[50,'Apathy'],[75,'Grief'],[100,'Fear'],
    [125,'Desire'],[150,'Anger'],[175,'Pride'],[200,'Courage'],[250,'Neutrality'],
    [310,'Willingness'],[350,'Acceptance'],[400,'Reason'],[500,'Love'],
    [540,'Joy'],[600,'Peace'],[700,'Enlightenment'],
  ]
  let closest = names[0]
  for (const [n, name] of names) {
    if (Math.abs(level - n) < Math.abs(level - closest[0])) closest = [n, name]
  }
  return closest[1]
}

export function exportWeeklyReport(analyses: Analysis[], savedWords: SavedWord[]): void {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const weekAnalyses = analyses.filter(a => a.timestamp >= weekAgo.getTime())
  const allAnalyses = analyses.slice(0, 30) // Last 30 for trend

  const levels = weekAnalyses.map(a => a.hawkinsLevel)
  const avgLevel = levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : 0
  const maxLevel = levels.length ? Math.max(...levels) : 0
  const minLevel = levels.length ? Math.min(...levels) : 0
  const trend = levels.length >= 2 ? levels[0] - levels[levels.length - 1] : 0

  const weekWords = savedWords.filter(w => w.savedAt >= weekAgo.getTime())

  // Dominant emotions frequency
  const emotionCount: Record<string, number> = {}
  weekAnalyses.forEach(a => {
    const e = a.dominantEmotion.toLowerCase()
    emotionCount[e] = (emotionCount[e] || 0) + 1
  })
  const topEmotions = Object.entries(emotionCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Mini bar chart data
  const chartItems = allAnalyses.slice(0, 14).reverse().map(a => ({
    date: new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    level: a.hawkinsLevel,
    color: levelColor(a.hawkinsLevel),
  }))

  const maxChartLevel = Math.max(...chartItems.map(c => c.level), 400)

  const chartBarsHtml = chartItems.map(item => {
    const pct = (item.level / maxChartLevel) * 100
    return `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:0;">
        <div style="font-size:9px;color:#8a8070;text-align:center;writing-mode:vertical-rl;transform:rotate(180deg);max-height:40px;overflow:hidden;">${item.level}</div>
        <div style="flex:1;width:100%;display:flex;align-items:flex-end;min-height:80px;">
          <div style="width:100%;border-radius:4px 4px 0 0;background:${item.color};"
               title="${item.date}: ${item.level}">
            <div style="height:${pct}%;min-height:4px;background:${item.color};border-radius:4px 4px 0 0;"></div>
          </div>
        </div>
        <div style="font-size:8px;color:#5a5050;white-space:nowrap;">${item.date}</div>
      </div>
    `
  }).join('')

  const sessionRowsHtml = weekAnalyses.slice(0, 10).map(a => `
    <tr>
      <td style="padding:10px 12px;font-size:11px;color:#8a8070;">
        ${new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
      </td>
      <td style="padding:10px 12px;">
        <span style="font-size:13px;font-weight:600;color:${levelColor(a.hawkinsLevel)}">${a.hawkinsLevel}</span>
        <span style="font-size:11px;color:#8a8070;margin-left:6px;">${levelName(a.hawkinsLevel)}</span>
      </td>
      <td style="padding:10px 12px;font-size:12px;color:#c8bfb0;text-transform:capitalize;">${a.dominantEmotion}</td>
      <td style="padding:10px 12px;font-size:11px;color:#8a8070;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
        "${a.mantra}"
      </td>
    </tr>
  `).join('')

  const weekWordsHtml = weekWords.map(w => `
    <div style="display:inline-block;margin:4px;">
      <span style="background:#1e1a17;border:1px solid #d4a24c40;color:#d4a24c;padding:4px 12px;border-radius:20px;font-size:12px;font-family:'Playfair Display',serif;">
        ${w.word}
      </span>
    </div>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WordWise — Weekly Report — ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</title>
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
    .page { max-width: 820px; margin: 0 auto; padding: 48px 48px 64px; }

    .header {
      display: flex; align-items: flex-start; justify-content: space-between;
      border-bottom: 1px solid #2e2824; padding-bottom: 28px; margin-bottom: 36px;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-name {
      font-family: 'Playfair Display', serif; font-size: 22px;
      background: linear-gradient(135deg, #d4a24c, #f0d080);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .brand-sub { font-size: 9px; color: #8a8070; text-transform: uppercase; letter-spacing: .12em; margin-top: 2px; }
    .header-right { text-align: right; }
    .report-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #f5f0e8; }
    .report-dates { font-size: 11px; color: #8a8070; margin-top: 4px; }

    .section-title {
      font-family: 'Playfair Display', serif; font-size: 17px; color: #f5f0e8;
      margin-bottom: 16px; margin-top: 32px;
      display: flex; align-items: center; gap: 10px;
    }
    .section-title::after { content: ''; flex: 1; height: 1px; background: #2e2824; }

    .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 8px; }
    .stat {
      background: #1e1a17; border: 1px solid #2e2824; border-radius: 12px;
      padding: 14px; text-align: center;
    }
    .stat-val { font-size: 24px; font-weight: 700; }
    .stat-label { font-size: 9px; color: #8a8070; text-transform: uppercase; letter-spacing: .08em; margin-top: 4px; }

    .chart-wrap {
      background: #1e1a17; border: 1px solid #2e2824; border-radius: 14px;
      padding: 20px; display: flex; align-items: flex-end; gap: 4px; height: 180px;
      position: relative;
    }
    .chart-line {
      position: absolute; left: 20px; right: 20px;
      border-top: 1px dashed #d4a24c40;
      top: ${Math.round((1 - 200 / maxChartLevel) * 140) + 20}px;
    }
    .chart-line-label {
      position: absolute; right: 24px;
      top: ${Math.round((1 - 200 / maxChartLevel) * 140) + 12}px;
      font-size: 9px; color: #d4a24c80;
    }

    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .08em;
      color: #8a8070; padding: 8px 12px; border-bottom: 1px solid #2e2824;
    }
    tr:nth-child(even) td { background: #141210; }
    tr { border-bottom: 1px solid #1e1a17; }

    .emotion-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .emotion-bar-track { flex: 1; height: 6px; background: #2e2824; border-radius: 3px; overflow: hidden; }
    .emotion-bar-fill { height: 100%; border-radius: 3px; background: #d4a24c; }
    .emotion-name { width: 100px; font-size: 12px; color: #c8bfb0; text-transform: capitalize; }
    .emotion-count { width: 24px; font-size: 11px; color: #8a8070; text-align: right; }

    .insight-box {
      background: #141210; border: 1px solid #2e2824; border-radius: 12px;
      padding: 16px 20px; margin-top: 8px;
    }

    .footer {
      border-top: 1px solid #2e2824; margin-top: 48px; padding-top: 20px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .footer-brand { font-family: 'Playfair Display', serif; font-size: 13px; color: #5a5050; }
    .footer-note { font-size: 10px; color: #3d3530; font-style: italic; margin-top: 3px; }

    @media print {
      body { background: #0a0908 !important; }
      .page { padding: 32px 40px 48px; }
      .section-title { margin-top: 22px; }
    }
  </style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="brand">
      <span style="font-size:32px;">🌳</span>
      <div>
        <div class="brand-name">WordWise</div>
        <div class="brand-sub">Weekly Calibration Report</div>
      </div>
    </div>
    <div class="header-right">
      <div class="report-title">Weekly Report</div>
      <div class="report-dates">
        ${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —
        ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats-grid">
    <div class="stat">
      <div class="stat-val" style="color:${levelColor(avgLevel)}">${avgLevel || '—'}</div>
      <div class="stat-label">Avg Level</div>
    </div>
    <div class="stat">
      <div class="stat-val" style="color:#00b894">${maxLevel || '—'}</div>
      <div class="stat-label">Peak</div>
    </div>
    <div class="stat">
      <div class="stat-val" style="color:#e74c3c">${minLevel || '—'}</div>
      <div class="stat-label">Low</div>
    </div>
    <div class="stat">
      <div class="stat-val" style="color:${trend > 0 ? '#00b894' : trend < 0 ? '#e74c3c' : '#8a8070'}">
        ${trend > 0 ? '+' : ''}${trend || '—'}
      </div>
      <div class="stat-label">Week Trend</div>
    </div>
    <div class="stat">
      <div class="stat-val" style="color:#d4a24c">${weekAnalyses.length}</div>
      <div class="stat-label">Sessions</div>
    </div>
  </div>

  <!-- Chart -->
  ${chartItems.length > 0 ? `
  <div class="section-title">📈 Calibration Arc</div>
  <div class="chart-wrap" style="height:160px;align-items:flex-end;">
    <div class="chart-line"></div>
    <div class="chart-line-label">Courage 200</div>
    <div style="display:flex;gap:4px;width:100%;align-items:flex-end;height:120px;">
      ${chartItems.map(item => {
        const h = Math.max(4, (item.level / maxChartLevel) * 100)
        return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
          <div style="font-size:8px;color:${item.color}">${item.level}</div>
          <div style="height:${h}px;width:100%;background:${item.color};border-radius:3px 3px 0 0;min-height:4px;"></div>
          <div style="font-size:7px;color:#5a5050;text-align:center;writing-mode:vertical-rl;transform:rotate(180deg);height:30px;">${item.date}</div>
        </div>`
      }).join('')}
    </div>
  </div>
  ` : ''}

  <!-- Emotional Patterns -->
  ${topEmotions.length > 0 ? `
  <div class="section-title">🎭 Emotional Patterns</div>
  <div style="background:#1e1a17;border:1px solid #2e2824;border-radius:14px;padding:20px;">
    ${topEmotions.map(([emotion, count]) => `
      <div class="emotion-row">
        <div class="emotion-name">${emotion}</div>
        <div class="emotion-bar-track">
          <div class="emotion-bar-fill" style="width:${(count / weekAnalyses.length) * 100}%"></div>
        </div>
        <div class="emotion-count">${count}×</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Sessions -->
  ${weekAnalyses.length > 0 ? `
  <div class="section-title">📋 This Week's Sessions</div>
  <div style="background:#1e1a17;border:1px solid #2e2824;border-radius:14px;overflow:hidden;">
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Level</th><th>Emotion</th><th>Mantra</th>
        </tr>
      </thead>
      <tbody>
        ${sessionRowsHtml}
      </tbody>
    </table>
  </div>
  ` : '<div style="text-align:center;padding:40px;color:#8a8070;">No sessions this week yet.</div>'}

  <!-- New words -->
  ${weekWords.length > 0 ? `
  <div class="section-title">✦ Words Forged This Week</div>
  <div style="background:#1e1a17;border:1px solid #2e2824;border-radius:14px;padding:16px;">
    ${weekWordsHtml}
  </div>
  ` : ''}

  <!-- Reflection prompt -->
  <div class="section-title">🌱 Weekly Reflection</div>
  <div class="insight-box">
    <div style="font-size:10px;color:#8a8070;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Prompts for your journal</div>
    <div style="font-size:13px;color:#c8bfb0;line-height:1.8;">
      ✦ What pattern do you notice across this week's calibration readings?<br/>
      ✦ Which of your forged words are you actually using?<br/>
      ✦ What situation consistently pulls your level down — and what would Courage look like there?<br/>
      ✦ Where did you surprise yourself this week?
    </div>
  </div>

  <div class="footer">
    <div>
      <div class="footer-brand">🌳 WordWise</div>
      <div class="footer-note">"Understand the roots of how you feel. Forge the words to become who you're meant to be."</div>
    </div>
    <div style="font-size:10px;color:#5a5050;text-align:right;">
      Generated ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
    </div>
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
