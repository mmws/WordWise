import type { Analysis } from '../types'

function levelColor(level: number): string {
  if (level < 100) return '#c0392b'
  if (level < 200) return '#e67e22'
  if (level < 310) return '#d4a24c'
  if (level < 500) return '#27ae60'
  return '#8e44ad'
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  for (const word of words) {
    const testLine = line + word + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, currentY)
      line = word + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY)
    currentY += lineHeight
  }
  return currentY
}

export function downloadShareCard(analysis: Analysis): void {
  const W = 1080
  const H = 1080
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  const color = levelColor(analysis.hawkinsLevel)

  // ── Background ──
  const bg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, H / 2, H)
  bg.addColorStop(0, '#1a150e')
  bg.addColorStop(1, '#0a0908')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(46,40,36,0.4)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // ── Glow ──
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500)
  glow.addColorStop(0, color + '18')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // ── Top border line ──
  const topGrad = ctx.createLinearGradient(120, 0, W - 120, 0)
  topGrad.addColorStop(0, 'transparent')
  topGrad.addColorStop(0.3, color)
  topGrad.addColorStop(0.7, color)
  topGrad.addColorStop(1, 'transparent')
  ctx.strokeStyle = topGrad
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(120, 90); ctx.lineTo(W - 120, 90); ctx.stroke()

  // ── Brand ──
  ctx.font = '900 28px serif'
  ctx.fillStyle = '#d4a24c'
  ctx.textAlign = 'left'
  ctx.fillText('🌳', 100, 75)
  ctx.font = '500 26px Georgia, serif'
  ctx.fillStyle = '#d4a24c'
  ctx.fillText('WordWise', 148, 72)

  // ── Level badge ──
  const badgeX = W - 100
  ctx.textAlign = 'right'
  ctx.font = 'bold 44px Georgia, serif'
  ctx.fillStyle = color
  ctx.fillText(String(analysis.hawkinsLevel), badgeX, 75)
  ctx.font = '400 18px Georgia, serif'
  ctx.fillText(analysis.hawkinsName, badgeX, 98)

  // ── Calibration bar ──
  const barY = 116
  const barH = 6
  const barPad = 100
  const barW = W - barPad * 2
  // Track
  ctx.fillStyle = '#2e2824'
  ctx.beginPath()
  ctx.roundRect(barPad, barY, barW, barH, 3)
  ctx.fill()
  // Fill
  const pct = Math.max(0.02, ((analysis.hawkinsLevel - 20) / 680))
  const barGrad = ctx.createLinearGradient(barPad, 0, barPad + barW, 0)
  barGrad.addColorStop(0, '#4a0000')
  barGrad.addColorStop(0.3, '#C47A00')
  barGrad.addColorStop(0.55, '#d4a24c')
  barGrad.addColorStop(0.8, '#5A9B8A')
  barGrad.addColorStop(1, '#AA7BAB')
  ctx.fillStyle = barGrad
  ctx.beginPath()
  ctx.roundRect(barPad, barY, barW * pct, barH, 3)
  ctx.fill()
  // Dot
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(barPad + barW * pct, barY + barH / 2, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#0a0908'
  ctx.lineWidth = 2
  ctx.stroke()

  // ── Emotion ──
  ctx.textAlign = 'center'
  ctx.font = 'italic 400 32px Georgia, serif'
  ctx.fillStyle = '#8a8070'
  ctx.fillText(analysis.dominantEmotion.charAt(0).toUpperCase() + analysis.dominantEmotion.slice(1), W / 2, 180)

  // ── Divider ──
  ctx.strokeStyle = '#2e2824'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(100, 200); ctx.lineTo(W - 100, 200); ctx.stroke()

  // ── Mantra ──
  ctx.textAlign = 'center'
  ctx.font = 'italic 600 19px Georgia, serif'
  ctx.fillStyle = '#8a8070'
  ctx.letterSpacing = '0.15em'
  ctx.fillText('YOUR MANTRA', W / 2, 245)

  // Mantra quote marks
  ctx.font = 'italic 700 80px Georgia, serif'
  ctx.fillStyle = color + '30'
  ctx.fillText('“', 115, 330)
  ctx.textAlign = 'right'
  ctx.fillText('”', W - 115, 420)

  // Mantra text
  ctx.textAlign = 'center'
  ctx.font = 'italic 400 38px Georgia, serif'
  ctx.fillStyle = '#d4a24c'
  wrapText(ctx, analysis.mantra, W / 2, 310, W - 240, 52)

  // ── Divider ──
  ctx.strokeStyle = '#2e2824'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(100, 460); ctx.lineTo(W - 100, 460); ctx.stroke()

  // ── Neologisms ──
  ctx.textAlign = 'center'
  ctx.font = '500 17px Georgia, serif'
  ctx.fillStyle = '#8a8070'
  ctx.letterSpacing = '0.15em'
  ctx.fillText('FORGED WORDS', W / 2, 505)

  const neos = analysis.neologisms.slice(0, 3)
  const neoW = (W - 140) / neos.length
  const neoStartX = 70

  neos.forEach((neo, i) => {
    const nx = neoStartX + neoW * i + neoW / 2
    const cardX = neoStartX + neoW * i + 10
    const cardY = 525
    const cardH = 200

    // Card background
    ctx.fillStyle = '#1e1a17'
    ctx.strokeStyle = color + '30'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(cardX, cardY, neoW - 20, cardH, 12)
    ctx.fill()
    ctx.stroke()

    // Word name
    ctx.textAlign = 'center'
    ctx.font = 'italic 600 30px Georgia, serif'
    ctx.fillStyle = '#d4a24c'
    ctx.fillText(neo.word, nx, cardY + 50)

    // Type
    ctx.font = '400 13px Inter, sans-serif'
    ctx.fillStyle = '#5a5050'
    ctx.fillText(neo.type, nx, cardY + 74)

    // Definition
    ctx.font = '400 14px Inter, sans-serif'
    ctx.fillStyle = '#8a8070'
    wrapText(ctx, neo.definition, nx, cardY + 108, neoW - 50, 20)
  })

  // ── Bottom divider ──
  ctx.strokeStyle = '#2e2824'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(100, 760); ctx.lineTo(W - 100, 760); ctx.stroke()

  // ── Root insight (truncated) ──
  ctx.textAlign = 'left'
  ctx.font = '400 15px Inter, sans-serif'
  ctx.fillStyle = '#5a5050'
  ctx.fillText('ROOT INSIGHT', 100, 798)
  ctx.font = 'italic 400 16px Georgia, serif'
  ctx.fillStyle = '#8a8070'
  const insight = analysis.rootInsight.length > 140
    ? analysis.rootInsight.slice(0, 137) + '...'
    : analysis.rootInsight
  wrapText(ctx, insight, 100, 826, W - 200, 24)

  // ── Bottom border ──
  const botGrad = ctx.createLinearGradient(120, 0, W - 120, 0)
  botGrad.addColorStop(0, 'transparent')
  botGrad.addColorStop(0.3, color)
  botGrad.addColorStop(0.7, color)
  botGrad.addColorStop(1, 'transparent')
  ctx.strokeStyle = botGrad
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(120, H - 90); ctx.lineTo(W - 120, H - 90); ctx.stroke()

  // ── Footer ──
  ctx.textAlign = 'left'
  ctx.font = '400 20px Georgia, serif'
  ctx.fillStyle = '#3d3530'
  ctx.fillText('🌳 wordwise.app', 100, H - 50)
  ctx.textAlign = 'right'
  ctx.font = '400 14px Inter, sans-serif'
  ctx.fillStyle = '#3d3530'
  ctx.fillText(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), W - 100, H - 50)

  // ── Download ──
  canvas.toBlob(blob => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const emotion = analysis.dominantEmotion.replace(/\s+/g, '-').toLowerCase()
    a.download = `wordwise-${emotion}-${analysis.hawkinsLevel}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
