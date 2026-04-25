import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDarkMode } from '../store/uiSlice'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/planner', label: 'Trip Planner' },
  { to: '/saved', label: 'Saved Trips' },
]

export default function Navbar() {
  const dispatch = useDispatch()
  const darkMode = useSelector((s) => s.ui.darkMode)
  const savedCount = useSelector((s) => s.trips.saved.length)
  const { pathname } = useLocation()

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-3xl tracking-widest">
              Sport<span className="text-accent">Trip</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  pathname === link.to
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {link.to === '/saved' && savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  )
}
