import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export function RedefinirSenhaPage() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    setLoading(true)
    const err = await updatePassword(password)
    setLoading(false)
    if (err) setError(err)
    else navigate('/app/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center"><Logo /></div>
        <h1 className="text-2xl font-bold text-navy dark:text-ice text-center">Nova senha</h1>
        <p className="mt-2 text-sm text-text-muted text-center">Defina sua nova senha de acesso.</p>

        {error && <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input label="Nova senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Input label="Confirmar senha" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" variant="gold" fullWidth disabled={loading}>{loading ? 'Salvando...' : 'Salvar nova senha'}</Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-gold hover:underline">Voltar ao login</Link>
        </p>
      </div>
    </div>
  )
}
