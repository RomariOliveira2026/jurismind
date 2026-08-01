interface SystemStatusProps {
  syncTime: string
}

export function SystemStatus({ syncTime }: SystemStatusProps) {
  return (
    <div className="inline-flex flex-col items-end gap-0.5 text-right">
      <div className="flex items-center gap-2 text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-medium text-navy dark:text-ice">Sistema operacional</span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-text-muted dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          IA Online
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Sincronizado {syncTime}</span>
      </div>
    </div>
  )
}
