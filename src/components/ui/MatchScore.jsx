export default function MatchScore({ score, className = '' }) {
  let colorClass = 'bg-error/15 text-error'
  if (score >= 80) colorClass = 'bg-success/15 text-success'
  else if (score >= 60) colorClass = 'bg-warning/15 text-warning'

  return (
    <span className={`inline-flex items-center font-mono font-bold text-xs px-2.5 py-1 rounded-full ${colorClass} ${className}`}>
      {score}% match
    </span>
  )
}
