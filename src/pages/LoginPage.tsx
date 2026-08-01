import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err)
    else navigate(from, { replace: true })
  }

  const handleDemo = async () => {
    setLoading(true)
    await signInDemo()
    setLoading(false)
    navigate('/app/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 gradient-navy lg:flex lg:flex-col lg:justify-center lg:px-16">
        <Logo light showSlogan />
        <h2 className="mt-8 text-3xl font-bold text-white">Bem-vindo de volta</h2>
        <p className="mt-4 text-slate-300">
          Acesse sua conta e continue gerenciando seus processos com inteligência.
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-2xl font-bold text-navy dark:text-ice">Entrar</h1>
          <p className="mt-2 text-sm text-text-muted">
            Não tem conta?{' '}
            <Link to="/cadastro" className="font-medium text-gold hover:underline">Cadastre-se grátis</Link>
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Senha" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text">
                <input type="checkbox" className="rounded border-slate-300" />
                Lembrar-me
              </label>
              <Link to="/recuperar-senha" className="text-sm text-gold hover:underline">Esqueci a senha</Link>
            </div>
            <Button type="submit" variant="gold" fullWidth size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6">
            <Button variant="outline" fullWidth onClick={handleDemo} disabled={loading}>
              Ver demonstração
            </Button>
            <p className="mt-2 text-center text-xs text-text-muted">
              demo@jurismind.com.br · demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
