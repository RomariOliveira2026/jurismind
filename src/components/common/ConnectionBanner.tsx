import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { checkSupabaseConnection, getConnectionMessage } from '../../lib/supabase'
import { env } from '../../config/env'

export function ConnectionBanner() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (env.demoMode) return
    checkSupabaseConnection().then(() => setMessage(getConnectionMessage()))
  }, [])

  if (!message) return null

  return (
    <div className="flex items-center justify-center gap-2 bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-center text-xs text-red-700 dark:text-red-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  )
}
