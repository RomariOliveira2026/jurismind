import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '../ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Erro capturado — não logar dados sensíveis
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ice dark:bg-navy p-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-navy dark:text-ice mb-2">Algo deu errado</h1>
            <p className="text-sm text-text-muted mb-6">
              Ocorreu um erro inesperado. Recarregue a página ou tente novamente.
            </p>
            <Button variant="gold" onClick={() => window.location.reload()}>
              Recarregar página
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
