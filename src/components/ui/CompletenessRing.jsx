export default function CompletenessRing({ percentage = 0, size = 40, className = '' }) {
  const strokeWidth = size * 0.1
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  let strokeColor = '#FF6B6B' // coral < 50
  if (percentage >= 80) strokeColor = '#4ECDC4' // teal
  else if (percentage >= 50) strokeColor = '#F59E0B' // amber

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/5 dark:text-white/5 text-black/5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span 
        className="absolute font-mono font-bold"
        style={{ fontSize: size * 0.28, color: strokeColor }}
      >
        {percentage}
      </span>
    </div>
  )
}
