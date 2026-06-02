import { getLevelPercent, getLevelForScore } from '../hawkins'

interface Props {
  level: number
  range?: [number, number]
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function HawkinsMeter({ level, range, size = 'md', showLabel = true }: Props) {
  const pct = getLevelPercent(level)
  const info = getLevelForScore(level)
  const isPower = info.power === 'power'

  const heights = { sm: 'h-2', md: 'h-3', lg: 'h-4' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${textSizes[size]}`} style={{ color: info.color }}>
              {info.name}
            </span>
            <span className={`${textSizes[size]} text-parchment-muted`}>
              Level {level}
            </span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            isPower
              ? 'border-green-700/40 text-green-400 bg-green-900/20'
              : 'border-red-800/40 text-red-400 bg-red-900/20'
          }`}>
            {isPower ? '⚡ Power' : '🔗 Force'}
          </span>
        </div>
      )}

      {/* Bar */}
      <div className={`relative w-full ${heights[size]} rounded-full overflow-hidden bg-root-muted`}>
        <div className="absolute inset-0 calibration-bar opacity-30 rounded-full" />
        <div
          className="absolute inset-y-0 left-0 calibration-bar rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
        {/* Range indicator */}
        {range && (
          <div
            className="absolute inset-y-0 rounded-full opacity-40"
            style={{
              left: `${getLevelPercent(range[0])}%`,
              width: `${getLevelPercent(range[1]) - getLevelPercent(range[0])}%`,
              background: info.color,
            }}
          />
        )}
        {/* Needle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-root-bg transition-all duration-1000 ease-out"
          style={{ left: `${pct}%`, background: info.color }}
        />
      </div>

      {/* Scale labels */}
      {size !== 'sm' && (
        <div className="flex justify-between text-[9px] text-parchment-muted/60 tracking-wider uppercase">
          <span>Shame</span>
          <span>Fear</span>
          <span>Courage</span>
          <span>Love</span>
          <span>Peace</span>
        </div>
      )}

      {showLabel && size !== 'sm' && (
        <div className="text-xs text-parchment-muted italic">{info.description}</div>
      )}
    </div>
  )
}
