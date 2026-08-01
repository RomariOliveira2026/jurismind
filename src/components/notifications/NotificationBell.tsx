import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  countUnreadNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/taskService'
import type { Notification } from '../../types/entities'

export function NotificationBell() {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const load = async () => {
    if (!session) return
    const [items, count] = await Promise.all([
      listNotifications(session.userId),
      countUnreadNotifications(session.userId),
    ])
    setNotifications(items)
    setUnread(count)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [session?.userId])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleRead = async (id: string) => {
    await markNotificationRead(id)
    load()
  }

  const handleReadAll = async () => {
    if (!session) return
    await markAllNotificationsRead(session.userId)
    load()
  }

  const getLink = (n: Notification) => {
    if (n.referenceType === 'deadline') return `/app/prazos`
    if (n.referenceType === 'publication') return `/app/publicacoes`
    if (n.referenceType === 'task') return `/app/agenda`
    return '/app/dashboard'
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-text hover:bg-slate-100 dark:text-ice dark:hover:bg-navy-light cursor-pointer"
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-navy-light">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <span className="font-semibold text-navy dark:text-ice text-sm">Notificações</span>
            {unread > 0 && (
              <button onClick={handleReadAll} className="flex items-center gap-1 text-xs text-gold hover:underline cursor-pointer">
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-text-muted">Nenhuma notificação</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-slate-100 px-4 py-3 last:border-0 dark:border-slate-700 ${!n.read ? 'bg-gold/5' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link to={getLink(n)} onClick={() => { handleRead(n.id); setOpen(false) }} className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy dark:text-ice">{n.title}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.message}</p>
                    </Link>
                    {!n.read && (
                      <button onClick={() => handleRead(n.id)} className="shrink-0 text-gold cursor-pointer" aria-label="Marcar como lida">
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
