import { Loader2 } from 'lucide-react'

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-gold" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  )
}
