import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, Bell, Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

const navLinks = [
  { to: '/dashboard/home', label: 'Home' },
  { to: '/dashboard/explore', label: 'Explore' },
  { to: '/dashboard/projects', label: 'Projects' },
  { to: '/dashboard/students', label: 'Students' },
  { to: '/dashboard/finder', label: 'Finder' },
]

export default function Navbar() {
  const { isLoggedIn, user, theme, toggleTheme, logout, getUnreadCount } = useAppStore()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const unreadCount = isLoggedIn ? getUnreadCount() : 0

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/login')
  }

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300
      ${scrolled 
        ? 'bg-bg-surface/95 dark:bg-bg-surface/95 bg-bg-surface-light/95 backdrop-blur-sm border-b border-white/8 dark:border-white/8 border-black/10' 
        : 'bg-transparent'}
    `}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link 
          to={isLoggedIn ? '/dashboard/home' : '/'}
          className="flex items-center gap-2 group"
        >
          <span className="text-coral text-xl">◆</span>
          <span className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light group-hover:text-coral transition-colors">
            Crux
          </span>
        </Link>

        {/* Center nav links (logged in, desktop) */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  px-3 py-2 text-sm font-medium transition-colors relative
                  ${isActive 
                    ? 'text-text-primary dark:text-text-primary text-text-primary-light' 
                    : 'text-text-secondary dark:text-text-secondary text-text-secondary-light hover:text-text-primary dark:hover:text-text-primary hover:text-text-primary-light'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-coral rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isLoggedIn ? (
            <>
              {/* Notifications bell */}
              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
                  aria-label="User menu"
                >
                  <Avatar name={user?.name} color={user?.avatarColor} size={32} />
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg shadow-card-hover animate-slide-down py-1 overflow-hidden">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="border-t border-white/8 dark:border-white/8 border-black/10 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup" className="hidden sm:block">
                <Button size="sm">Join Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isLoggedIn && mobileOpen && (
        <div className="md:hidden bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border-t border-white/8 dark:border-white/8 border-black/10 animate-slide-down">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'text-coral bg-coral/10' 
                    : 'text-text-secondary dark:text-text-secondary text-text-secondary-light hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5'}
                `}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
