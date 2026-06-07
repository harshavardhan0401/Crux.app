const proficiencyStyles = {
  learning: 'border border-white/10 dark:border-white/10 border-black/10 text-text-muted dark:text-text-muted text-text-muted-light',
  comfortable: 'border border-teal/50 text-teal bg-teal/10',
  strong: 'bg-teal text-bg-base font-medium',
}

export default function SkillChip({ name, proficiency = 'learning', onClick, className = '' }) {
  const Component = onClick ? 'button' : 'span'
  
  return (
    <Component
      onClick={onClick}
      className={`
        font-mono text-xs px-3 py-1 rounded-full inline-flex items-center gap-1
        transition-all duration-150
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${proficiencyStyles[proficiency] || proficiencyStyles.learning}
        ${className}
      `}
    >
      {name}
    </Component>
  )
}
