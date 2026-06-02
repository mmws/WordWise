import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', label: 'Home', icon: '🌿' },
  { to: '/checkin', label: 'Check In', icon: '✦' },
  { to: '/lexicon', label: 'Lexicon', icon: '📖' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

const modeItems = [
  { to: '/relationship', label: 'Relationship', icon: '💞' },
  { to: '/goals', label: 'Goal Forge', icon: '⚗️' },
  { to: '/landing', label: 'About', icon: '🌳' },
]

export default function Layout() {
  const { apiKey } = useApp()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-root-border"
        style={{ background: 'rgba(10,9,8,0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🌳</span>
            <div>
              <div className="font-display text-lg text-gradient font-semibold leading-tight">WordWise</div>
              <div className="text-[10px] text-parchment-muted tracking-widest uppercase leading-tight">Forge Your Words</div>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
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
            <div className="w-px h-5 bg-root-border mx-1" />
            {modeItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
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
          </nav>

          {!apiKey && location.pathname !== '/settings' && (
            <NavLink to="/settings"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-amber-dim/40 text-amber-glow hover:bg-amber-dim/10 transition-all">
              <span>⚠</span> Add API Key
            </NavLink>
          )}
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-root-border"
        style={{ background: 'rgba(10,9,8,0.96)', backdropFilter: 'blur(16px)' }}>
        <div className="flex">
          {navItems.map(item => (
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
