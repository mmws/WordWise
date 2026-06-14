import { useEffect, useRef, useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', label: 'Home', icon: '🌿' },
  { to: '/checkin', label: 'Check In', icon: '✦' },
  { to: '/lexicon', label: 'Lexicon', icon: '📖' },
  { to: '/progress', label: 'Progress', icon: '📈' },
]

const mobileNavItems = [
  ...navItems,
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

const moreItems = [
  { to: '/relationship', label: 'Relationship', icon: '💞' },
  { to: '/goals', label: 'Goal Forge', icon: '⚗️' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
  { to: '/landing', label: 'About', icon: '🌳' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
    isActive
      ? 'bg-amber-dim/30 text-amber-glow'
      : 'text-parchment-muted hover:text-parchment hover:bg-root-muted/40'
  }`

export default function Layout() {
  const { apiKey } = useApp()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => setMoreOpen(false), [location.pathname])

  const isMoreActive = moreItems.some(item => location.pathname === item.to)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-root-border"
        style={{ background: 'rgba(10,9,8,0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="text-2xl">🌳</span>
            <div>
              <div className="font-display text-lg text-gradient font-semibold leading-tight">WordWise</div>
              <div className="text-[10px] text-parchment-muted tracking-widest uppercase leading-tight">Forge Your Words</div>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(o => !o)}
                className={`px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isMoreActive || moreOpen
                    ? 'bg-amber-dim/30 text-amber-glow'
                    : 'text-parchment-muted hover:text-parchment hover:bg-root-muted/40'
                }`}
              >
                <span className="text-base">⋯</span>
                More
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-root-border bg-root-bg shadow-xl overflow-hidden animate-fade-in">
                  {moreItems.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-amber-dim/30 text-amber-glow'
                            : 'text-parchment-muted hover:text-parchment hover:bg-root-muted/40'
                        }`
                      }
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {!apiKey && location.pathname !== '/settings' && (
            <NavLink to="/settings"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-amber-dim/40 text-amber-glow hover:bg-amber-dim/10 transition-all whitespace-nowrap shrink-0">
              <span>⚠</span> Add Key
            </NavLink>
          )}
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-root-border"
        style={{ background: 'rgba(10,9,8,0.96)', backdropFilter: 'blur(16px)' }}>
        <div className="flex">
          {mobileNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-amber-glow' : 'text-parchment-muted'
                }`
              }
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>
    </div>
  )
}
