import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { getLevelForScore } from '../hawkins'
import { exportWeeklyReport } from '../utils/weeklyReportPdf'

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { emotion: string; level: number; date: string } }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const level = getLevelForScore(d.level)
  return (
    <div className="glass-card p-3 text-sm border border-root-border" style={{ borderColor: level.color + '40' }}>
      <div className="text-parchment-muted text-xs mb-1">{d.date}</div>
      <div className="font-semibold" style={{ color: level.color }}>{d.level} · {level.name}</div>
      <div className="text-parchment-muted capitalize">{d.emotion}</div>
    </div>
  )
}

export default function Progress() {
  const { analyses, savedWords, clearHistory } = useApp()
  const [exporting, setExporting] = useState(false)

  function handleWeeklyReport() {
    setExporting(true)
    setTimeout(() => {
      exportWeeklyReport(analyses, savedWords)
      setExporting(false)
    }, 100)
  }

  if (analyses.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="text-5xl">📈</div>
        <div className="font-display text-2xl text-parchment">No data yet</div>
        <p className="text-parchment-muted text-sm max-w-xs">
          Complete check-ins to track your consciousness calibration over time.
        </p>
        <Link to="/checkin" className="btn-primary">Begin Check-In</Link>
      </div>
    )
  }

  // Build chart data (oldest first)
  const chartData = [...analyses]
    .reverse()
    .map(a => ({
      date: new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      level: a.hawkinsLevel,
      emotion: a.dominantEmotion,
    }))

  const levels = analyses.map(a => a.hawkinsLevel)
  const avg = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length)
  const max = Math.max(...levels)
  const min = Math.min(...levels)
  const latest = levels[0]
  const previous = levels[1]
  const trend = previous ? latest - previous : 0

  const avgLevel = getLevelForScore(avg)
  const latestLevel = getLevelForScore(latest)

  // Frequency breakdown
  const zoneCounts = {
    'Force (<200)': levels.filter(l => l < 200).length,
    'Courage (200)': levels.filter(l => l >= 200 && l < 310).length,
    'Expansion (310–500)': levels.filter(l => l >= 310 && l < 500).length,
    'Power (500+)': levels.filter(l => l >= 500).length,
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-parchment">Consciousness Curve</h1>
          <p className="text-parchment-muted text-sm mt-1">{analyses.length} check-ins tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleWeeklyReport}
            disabled={exporting || analyses.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-amber-dim/40 text-amber-glow hover:bg-amber-dim/10 active:scale-95 transition-all duration-150 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {exporting ? 'Opening...' : 'Weekly Report'}
          </button>
          <div className="text-4xl">📈</div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: latestLevel.color }}>{latest}</div>
          <div className="text-xs text-parchment-muted mt-1">Current</div>
          <div className="text-xs font-medium mt-0.5" style={{ color: latestLevel.color }}>{latestLevel.name}</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: avgLevel.color }}>{avg}</div>
          <div className="text-xs text-parchment-muted mt-1">Average</div>
          <div className="text-xs font-medium mt-0.5" style={{ color: avgLevel.color }}>{avgLevel.name}</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{max}</div>
          <div className="text-xs text-parchment-muted mt-1">Peak</div>
          <div className="text-xs font-medium text-green-400 mt-0.5">{getLevelForScore(max).name}</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className={`text-2xl font-bold ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-parchment-muted'}`}>
            {trend > 0 ? '+' : ''}{trend || '—'}
          </div>
          <div className="text-xs text-parchment-muted mt-1">Last shift</div>
          <div className={`text-xs font-medium mt-0.5 ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-parchment-muted'}`}>
            {trend > 0 ? '↑ Rising' : trend < 0 ? '↓ Falling' : '→ Stable'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-5 space-y-3">
        <div className="text-sm font-medium text-parchment">Calibration Over Time</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="levelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4a24c" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#d4a24c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2824" />
            <XAxis dataKey="date" tick={{ fill: '#8a8070', fontSize: 10 }} tickLine={false} />
            <YAxis domain={[0, 720]} tick={{ fill: '#8a8070', fontSize: 10 }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {/* Power line at 200 */}
            <ReferenceLine y={200} stroke="#d4a24c" strokeDasharray="4 4" strokeOpacity={0.4}
              label={{ value: 'Power', fill: '#d4a24c', fontSize: 10, dx: 4 }} />
            <Area
              type="monotone"
              dataKey="level"
              stroke="#d4a24c"
              strokeWidth={2}
              fill="url(#levelGrad)"
              dot={{ fill: '#d4a24c', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#f0d080', r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Zone breakdown */}
      <div className="glass-card p-5 space-y-4">
        <div className="text-sm font-medium text-parchment">Zone Breakdown</div>
        <div className="space-y-3">
          {Object.entries(zoneCounts).map(([zone, count]) => {
            const pct = analyses.length ? Math.round((count / analyses.length) * 100) : 0
            const colors: Record<string, string> = {
              'Force (<200)': '#c0392b',
              'Courage (200)': '#d4a24c',
              'Expansion (310–500)': '#00cec9',
              'Power (500+)': '#a29bfe',
            }
            return (
              <div key={zone} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-parchment-muted">{zone}</span>
                  <span className="text-parchment-dim">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-root-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: colors[zone] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent history */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-parchment">Recent Sessions</div>
        {analyses.slice(0, 10).map(a => {
          const lvl = getLevelForScore(a.hawkinsLevel)
          return (
            <div key={a.id} className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: lvl.bgColor, color: lvl.color }}>
                {a.hawkinsLevel}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-parchment capitalize">{a.dominantEmotion}</div>
                <div className="text-xs text-parchment-muted truncate mt-0.5">"{a.userInput}"</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-medium" style={{ color: lvl.color }}>{lvl.name}</div>
                <div className="text-xs text-parchment-muted mt-0.5">
                  {new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {analyses.length > 5 && (
        <div className="text-center">
          <button
            onClick={() => confirm('Clear all session history?') && clearHistory()}
            className="text-xs text-parchment-muted/50 hover:text-red-400 transition-colors"
          >
            Clear history
          </button>
        </div>
      )}
    </div>
  )
}
