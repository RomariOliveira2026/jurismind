import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export function RecuperarSenhaPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const err = await resetPassword(email)
    setLoading(false)
    if (err) setError(err)
    else setMessage('Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center"><Logo /></div>
        <h1 className="text-2xl font-bold text-navy dark:text-ice text-center">Recuperar senha</h1>
        <p className="mt-2 text-sm text-text-muted text-center">Informe seu e-mail para receber o link de redefinição.</p>

        {error && <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{message}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" variant="gold" fullWidth disabled={loading}>{loading ? 'Enviando...' : 'Enviar link'}</Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-gold hover:underline">Voltar ao login</Link>
        </p>
      </div>
    </div>
  )
}
