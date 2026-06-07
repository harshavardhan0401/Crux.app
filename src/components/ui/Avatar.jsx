import { getAvatarColor } from '../../utils/avatarColor'

export default function Avatar({ name, color, size = 48, image, className = '', showActive, isActive }) {
  const bgColor = color || getAvatarColor(name || 'User')
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  
  return (
    <div className={`relative inline-flex ${className}`}>
      {image ? (
        <img
          src={image}
          alt={name}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center font-semibold text-white select-none"
          style={{ 
            width: size, 
            height: size, 
            backgroundColor: bgColor,
            fontSize: size * 0.38,
          }}
        >
          {initials}
        </div>
      )}
      {showActive && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-bg-surface dark:border-bg-surface border-bg-surface-light ${isActive ? 'bg-success' : 'bg-text-muted'}`}
          style={{ width: size * 0.2, height: size * 0.2, minWidth: 8, minHeight: 8 }}
        />
      )}
    </div>
  )
}
