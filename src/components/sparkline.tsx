interface SparklineProps {
  data: number[]
  color?: string
  height?: number
}

export function Sparkline({ data, color = "#CCFF00", height = 60 }: SparklineProps) {
  if (data.length < 2) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = range === 0 ? 50 : ((max - value) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width="100%" height={height} className="overflow-visible">
      {/* Grid lines */}
      <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="0" y1="100%" x2="100%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* Area fill */}
      <polygon points={`0,100 ${points} 100,100`} fill={`${color}20`} stroke="none" />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Dots on hover */}
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = range === 0 ? 50 : ((max - value) / range) * 100
        return (
          <circle
            key={index}
            cx={`${x}%`}
            cy={`${y}%`}
            r="3"
            fill={color}
            className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <title>${value.toLocaleString()}</title>
          </circle>
        )
      })}
    </svg>
  )
}
