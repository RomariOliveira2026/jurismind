import { useEffect, useState } from 'react'
import { User, Building2, Bell, Shield, Moon, Sun, Users, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { getOrganizationMembers, getOrganizationSettings } from '../../services/taskService'
import type { OrganizationMember } from '../../types/auth'
import type { OrganizationSettings } from '../../types/entities'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { ROLE_LABELS } from '../../lib/permissions'

const TABS = ['perfil', 'escritorio', 'equipe', 'alertas', 'seguranca', 'aparencia', 'plano'] as const

export function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { session, hasPermission, isDemo, updatePassword } = useAuth()
  const [tab, setTab] = useState<typeof TABS[number]>('perfil')
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [settings, setSettings] = useState<OrganizationSettings | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  const orgId = session?.organization.id

  useEffect(() => {
    if (!orgId) return
    Promise.all([getOrganizationMembers(orgId), getOrganizationSettings(orgId)]).then(([m, s]) => {
      setMembers(m)
      setSettings(s)
    })
  }, [orgId])

  const tabLabels: Record<typeof TABS[number], string> = {
    perfil: 'Meu perfil', escritorio: 'Escritório', equipe: 'Equipe', alertas: 'Alertas',
    seguranca: 'Segurança', aparencia: 'Aparência', plano: 'Plano',
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700 pb-px">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 cursor-pointer ${tab === t ? 'border-gold text-gold' : 'border-transparent text-text-muted'}`}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {tab === 'perfil' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><User className="h-5 w-5 text-gold" /><CardTitle>Meu perfil</CardTitle></div></CardHeader>
          <div className="space-y-4">
            <Input label="Nome" defaultValue={session?.profile.fullName} />
            <Input label="E-mail" defaultValue={session?.profile.email} disabled />
            <Input label="Telefone" defaultValue={session?.profile.phone} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="OAB" defaultValue={session?.profile.oabNumber} />
              <Input label="UF" defaultValue={session?.profile.oabState} />
            </div>
            <Button variant="gold" size="sm">Salvar perfil</Button>
          </div>
        </Card>
      )}

      {tab === 'escritorio' && hasPermission('manageSettings') && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-gold" /><CardTitle>Escritório</CardTitle></div></CardHeader>
          <div className="space-y-4">
            <Input label="Nome" defaultValue={session?.organization.name} />
            <Input label="CNPJ/CPF" defaultValue={session?.organization.document} />
            <Input label="E-mail" defaultValue={session?.organization.email} />
            <Input label="Telefone" defaultValue={session?.organization.phone} />
            <Input label="Endereço" defaultValue={session?.organization.address} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Cidade" defaultValue={session?.organization.city} />
              <Input label="Estado" defaultValue={session?.organization.state} />
            </div>
            <Button variant="gold" size="sm">Salvar escritório</Button>
          </div>
        </Card>
      )}

      {tab === 'equipe' && hasPermission('manageTeam') && (
        <Card>
          <CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-gold" /><CardTitle>Equipe</CardTitle></div><Button variant="gold" size="sm">Convidar membro</Button></div></CardHeader>
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-navy dark:text-ice">{m.profile?.fullName}</p>
                  <p className="text-xs text-text-muted">{m.profile?.email}</p>
                </div>
                <Badge variant="gold">{ROLE_LABELS[m.role as keyof typeof ROLE_LABELS]}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'alertas' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Bell className="h-5 w-5 text-gold" /><CardTitle>Alertas</CardTitle></div></CardHeader>
          <div className="space-y-4">
            <Select label="Antecedência" options={[{ value: '1', label: '1 dia' }, { value: '3', label: '3 dias' }, { value: '7', label: '7 dias' }]} defaultValue={String(settings?.deadlineAlertDays ?? 3)} />
            {[
              { label: 'Alertas por e-mail', checked: settings?.emailAlerts ?? true, future: false },
              { label: 'Alertas por WhatsApp', checked: settings?.whatsappAlerts ?? false, future: true },
              { label: 'Resumo diário', checked: settings?.dailySummary ?? true, future: false },
              { label: 'Resumo semanal', checked: settings?.weeklySummary ?? true, future: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-3 text-sm">
                <input type="checkbox" defaultChecked={item.checked} disabled={item.future} className="rounded" />
                {item.label}{item.future && <span className="text-xs text-text-muted">(em breve)</span>}
              </label>
            ))}
            <Button variant="gold" size="sm">Salvar preferências</Button>
          </div>
        </Card>
      )}

      {tab === 'seguranca' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Shield className="h-5 w-5 text-gold" /><CardTitle>Segurança</CardTitle></div></CardHeader>
          <Link to="/app/configuracoes/ia" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-2">
            Governança da IA →
          </Link>
          <Link to="/app/diagnostico-ia" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-4">
            Diagnóstico de IA →
          </Link>
          {!isDemo ? (
            <form
              className="space-y-4 mb-6"
              onSubmit={async (e) => {
                e.preventDefault()
                setPasswordErr('')
                setPasswordMsg('')
                if (newPassword.length < 6) { setPasswordErr('A senha deve ter pelo menos 6 caracteres.'); return }
                if (newPassword !== confirmPassword) { setPasswordErr('As senhas não coincidem.'); return }
                const err = await updatePassword(newPassword)
                if (err) setPasswordErr(err)
                else { setPasswordMsg('Senha alterada com sucesso.'); setNewPassword(''); setConfirmPassword('') }
              }}
            >
              <Input label="Nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input label="Confirmar senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {passwordErr && <p className="text-sm text-red-600">{passwordErr}</p>}
              {passwordMsg && <p className="text-sm text-green-600">{passwordMsg}</p>}
              <Button variant="gold" size="sm" type="submit">Alterar senha</Button>
            </form>
          ) : (
            <p className="text-sm text-text-muted mb-4">Alteração de senha indisponível no modo demonstração.</p>
          )}
          <Button variant="outline" size="sm">Solicitar exclusão da conta</Button>
          <p className="text-xs text-text-muted mt-2">Sua solicitação será analisada conforme a LGPD.</p>
        </Card>
      )}

      {tab === 'aparencia' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2">{theme === 'dark' ? <Moon className="h-5 w-5 text-gold" /> : <Sun className="h-5 w-5 text-gold" />}<CardTitle>Aparência</CardTitle></div></CardHeader>
          <div className="flex gap-3">
            <Button variant={theme === 'light' ? 'gold' : 'outline'} size="sm" onClick={() => setTheme('light')}><Sun className="h-4 w-4" />Claro</Button>
            <Button variant={theme === 'dark' ? 'gold' : 'outline'} size="sm" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" />Escuro</Button>
          </div>
        </Card>
      )}

      {tab === 'plano' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /><CardTitle>Plano e assinatura</CardTitle></div></CardHeader>
          <p className="text-lg font-bold text-navy dark:text-ice capitalize">Plano {session?.organization.plan}</p>
          <p className="text-sm text-text-muted mt-2">Integração com Stripe ou Mercado Pago — em breve.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {['Gratuito', 'Profissional', 'Escritório'].map((p) => (
              <div key={p} className="rounded-lg border border-slate-200 p-4 text-center dark:border-slate-700">
                <p className="font-semibold">{p}</p>
                <Button variant="outline" size="sm" className="mt-2" disabled>Em breve</Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
