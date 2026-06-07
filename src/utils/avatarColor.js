const COLORS = ['#FF6B6B','#C06AF2','#4ECDC4','#F59E0B','#22C55E','#3B82F6','#EC4899','#8B5CF6']

export function getAvatarColor(name) {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return COLORS[sum % COLORS.length]
}
