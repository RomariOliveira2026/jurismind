import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Moon, Sun, Search, LogOut } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { NotificationBell } from '../notifications/NotificationBell'
import { cn } from '../../lib/utils'

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const initials = session?.profile.fullName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'JM'

  useEffect(() => {
    if (!profileOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [profileOpen])

  const handleLogout = async () => {
    setProfileOpen(false)
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-navy/80 lg:px-6">
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="rounded-lg p-2 text-text hover:bg-slate-100 lg:hidden dark:text-ice dark:hover:bg-navy-light cursor-pointer shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-navy dark:text-ice">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 md:flex dark:border-slate-600 dark:bg-navy-light">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-40 bg-transparent text-sm text-text outline-none placeholder:text-slate-400 dark:text-ice lg:w-56"
          />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-text hover:bg-slate-100 dark:text-ice dark:hover:bg-navy-light cursor-pointer"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <NotificationBell />

        <div className="relative ml-1" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-label="Menu do perfil"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy cursor-pointer"
          >
            {initials}
          </button>
          <div
            role="menu"
            className={cn(
              'absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-navy-light',
              profileOpen ? 'block' : 'hidden',
            )}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => { setProfileOpen(false); navigate('/app/configuracoes') }}
              className="block w-full px-4 py-2 text-left text-sm text-text hover:bg-slate-50 dark:text-ice dark:hover:bg-navy cursor-pointer"
            >
              Configurações
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-navy cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
