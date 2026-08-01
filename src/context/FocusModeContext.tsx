import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface FocusModeContextValue {
  isFocusMode: boolean
  focusCaseId: string | null
  enterFocus: (caseId: string) => void
  exitFocus: () => void
}

const FocusModeContext = createContext<FocusModeContextValue | null>(null)
const STORAGE_KEY = 'jurismind-focus-mode'

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [focusCaseId, setFocusCaseId] = useState<string | null>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw).caseId : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (focusCaseId) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ caseId: focusCaseId }))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [focusCaseId])

  const enterFocus = useCallback((caseId: string) => setFocusCaseId(caseId), [])
  const exitFocus = useCallback(() => setFocusCaseId(null), [])

  return (
    <FocusModeContext.Provider
      value={{
        isFocusMode: !!focusCaseId,
        focusCaseId,
        enterFocus,
        exitFocus,
      }}
    >
      {children}
    </FocusModeContext.Provider>
  )
}

export function useFocusMode() {
  const ctx = useContext(FocusModeContext)
  if (!ctx) throw new Error('useFocusMode deve ser usado dentro de FocusModeProvider')
  return ctx
}
