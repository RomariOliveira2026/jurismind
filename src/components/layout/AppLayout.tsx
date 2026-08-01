import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { X, Focus } from 'lucide-react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { DemoBanner } from '../common/DemoBanner'
import { ConnectionBanner } from '../common/ConnectionBanner'
import { useAuth } from '../../context/AuthContext'
import { useFocusMode } from '../../context/FocusModeContext'
import { Button } from '../ui/Button'

const pageTitles: Record<string, string> = {
  '/app/intelligence': 'Centro de Inteligência',
  '/app/intelligence/timeline': 'Linha do tempo inteligente',
  '/app/intelligence/configuracoes': 'Configurações de inteligência',
  '/app/dashboard': 'Dashboard',
  '/app/clientes': 'Clientes',
  '/app/processos': 'Processos',
  '/app/prazos': 'Prazos',
  '/app/publicacoes': 'Publicações',
  '/app/agenda': 'Agenda',
  '/app/assistentes': 'Assistentes Jurídicos',
  '/app/ia': 'IA Jurídica',
  '/app/documentos': 'Documentos',
  '/app/relatorios': 'Relatórios',
  '/app/configuracoes': 'Configurações',
  '/app/diagnostico-ia': 'Diagnóstico de IA',
  '/app/configuracoes/ia': 'Governança da IA',
}

function resolveTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.startsWith('/app/clientes/')) return 'Detalhes do cliente'
  if (pathname.startsWith('/app/processos/')) return 'Detalhes do processo'
  return 'JurisMind'
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isDemo } = useAuth()
  const { isFocusMode, exitFocus } = useFocusMode()
  const title = resolveTitle(location.pathname)

  if (isFocusMode) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-ice dark:bg-navy">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-navy-light">
          <div className="flex items-center gap-2">
            <Focus className="h-5 w-5 text-gold" aria-hidden />
            <span className="text-sm font-semibold text-navy dark:text-ice">Modo Foco</span>
          </div>
          <Button variant="gold" size="sm" onClick={() => { exitFocus(); navigate('/app/processos') }}>
            <X className="h-4 w-4" /> Sair do modo foco
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ice dark:bg-navy">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {isDemo ? <DemoBanner /> : <ConnectionBanner />}
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
