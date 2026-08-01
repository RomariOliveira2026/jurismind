import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  Newspaper,
  Calendar,
  Brain,
  BarChart3,
  Settings,
  FolderOpen,
  X,
  Sparkles,
  Bot,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Logo } from '../Logo'

const menuItems = [
  { to: '/app/intelligence', icon: Sparkles, label: 'Centro de Inteligência' },
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/clientes', icon: Users, label: 'Clientes' },
  { to: '/app/processos', icon: Briefcase, label: 'Processos' },
  { to: '/app/prazos', icon: Clock, label: 'Prazos' },
  { to: '/app/publicacoes', icon: Newspaper, label: 'Publicações' },
  { to: '/app/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/app/assistentes', icon: Bot, label: 'Assistentes Jurídicos' },
  { to: '/app/ia', icon: Brain, label: 'IA Jurídica' },
  { to: '/app/documentos', icon: FolderOpen, label: 'Documentos' },
  { to: '/app/relatorios', icon: BarChart3, label: 'Relatórios' },
  { to: '/app/configuracoes', icon: Settings, label: 'Configurações' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-navy lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-700">
          <Logo />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-slate-100 lg:hidden dark:hover:bg-navy-light cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gold/10 text-gold'
                        : 'text-text hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-light',
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <div className="rounded-lg gradient-navy p-4">
            <p className="text-xs font-medium text-gold">Plano Profissional</p>
            <p className="mt-1 text-xs text-slate-300">14 dias restantes no trial</p>
          </div>
        </div>
      </aside>
    </>
  )
}
