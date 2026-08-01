import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export function CadastroPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    oabNumber: '',
    oabState: '',
    organizationName: '',
    organizationDocument: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    const result = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      phone: form.phone,
      oabNumber: form.oabNumber,
      oabState: form.oabState,
      organizationName: form.organizationName,
      organizationDocument: form.organizationDocument,
      acceptTerms: form.acceptTerms,
    })
    setLoading(false)
    if (result.error) setError(result.error)
    else if (result.needsEmailConfirmation) setMessage('Conta criada! Verifique seu e-mail para confirmar o cadastro.')
    else navigate('/app/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 gradient-navy lg:flex lg:flex-col lg:justify-center lg:px-16">
        <Logo light showSlogan />
        <h2 className="mt-8 text-3xl font-bold text-white">Comece gratuitamente</h2>
        <p className="mt-4 text-slate-300">Crie sua conta e transforme a gestão do seu escritório.</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-2xl font-bold text-navy dark:text-ice">Criar conta</h1>
          <p className="mt-2 text-sm text-text-muted">
            Já tem conta? <Link to="/login" className="font-medium text-gold hover:underline">Entrar</Link>
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Nome completo" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required />
            <Input label="E-mail" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
            <Input label="Telefone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="OAB" placeholder="123456" value={form.oabNumber} onChange={(e) => handleChange('oabNumber', e.target.value)} />
              <Input label="UF OAB" placeholder="SP" maxLength={2} value={form.oabState} onChange={(e) => handleChange('oabState', e.target.value)} />
            </div>
            <Input label="Nome do escritório" value={form.organizationName} onChange={(e) => handleChange('organizationName', e.target.value)} required />
            <Input label="CPF ou CNPJ do escritório" value={form.organizationDocument} onChange={(e) => handleChange('organizationDocument', e.target.value)} />
            <Input label="Senha" type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required />
            <Input label="Confirmar senha" type="password" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} required />
            <label className="flex items-start gap-2 text-xs text-text-muted">
              <input type="checkbox" checked={form.acceptTerms} onChange={(e) => handleChange('acceptTerms', e.target.checked)} className="mt-0.5 rounded" required />
              <span>
                Li e aceito os{' '}
                <Link to="/termos" className="text-gold hover:underline" target="_blank">Termos de Uso</Link>
                {' '}e a{' '}
                <Link to="/privacidade" className="text-gold hover:underline" target="_blank">Política de Privacidade</Link>.
              </span>
            </label>
            <Button type="submit" variant="gold" fullWidth size="lg" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta gratuita'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
