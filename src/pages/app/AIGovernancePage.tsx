import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Shield, Lock, Database, CheckSquare, Eye, History, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { LEGAL_ASSISTANTS } from '../../ai/assistants/registry'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { FairUsePolicyLink } from '../../components/pricing/FairUsePolicyLink'
import { FAIR_USE_POLICY_PATH } from '../../lib/aiFairUse'

const TABS = ['visao', 'assistentes', 'permissoes', 'fontes', 'validacao', 'privacidade', 'historico', 'uso'] as const

export function AIGovernancePage() {
  const [tab, setTab] = useState<typeof TABS[number]>('visao')
  const [retention, setRetention] = useState('90')
  const [storeInputs, setStoreInputs] = useState(true)
  const [storeOutputs, setStoreOutputs] = useState(true)

  const tabLabels: Record<typeof TABS[number], string> = {
    visao: 'Visão geral', assistentes: 'Assistentes', permissoes: 'Permissões',
    fontes: 'Fontes', validacao: 'Validação', privacidade: 'Privacidade',
    historico: 'Histórico', uso: 'Uso e custos',
  }

  return (
    <div className="space-y-6">
      <Link to="/app/configuracoes" className="text-sm text-gold hover:underline">← Configurações</Link>
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-gold" />
        <h2 className="text-2xl font-bold text-navy dark:text-ice">Governança da IA</h2>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700 pb-px">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 cursor-pointer ${tab === t ? 'border-gold text-gold' : 'border-transparent text-text-muted'}`}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {tab === 'visao' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Assistentes ativos', value: LEGAL_ASSISTANTS.filter((a) => a.status === 'ativo').length },
            { label: 'Análises no mês', value: '—' },
            { label: 'Validadas', value: '—' },
            { label: 'Rejeitadas', value: '—' },
          ].map((s) => (
            <Card key={s.label} padding="sm"><p className="text-xs text-text-muted">{s.label}</p><p className="text-2xl font-bold text-navy dark:text-ice">{s.value}</p></Card>
          ))}
        </div>
      )}

      {tab === 'assistentes' && (
        <div className="space-y-3">
          {LEGAL_ASSISTANTS.map((a) => (
            <Card key={a.id} padding="sm">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-medium">{a.name}</p><p className="text-xs text-text-muted">v{a.version}</p></div>
                <Badge variant={a.status === 'ativo' ? 'proximo' : 'futuro'}>{a.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'validacao' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><CheckSquare className="h-5 w-5 text-gold" /><CardTitle>Validação humana</CardTitle></div></CardHeader>
          <p className="text-sm text-text-muted">Checklist obrigatório antes de criar prazos, salvar rascunhos ou vincular análises.</p>
          <p className="text-sm mt-2">Configurável pelo administrador — padrão do sistema aplicado.</p>
        </Card>
      )}

      {tab === 'privacidade' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Eye className="h-5 w-5 text-gold" /><CardTitle>Privacidade</CardTitle></div></CardHeader>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={storeInputs} onChange={(e) => setStoreInputs(e.target.checked)} /> Armazenar entradas</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={storeOutputs} onChange={(e) => setStoreOutputs(e.target.checked)} /> Armazenar resultados</label>
            <Input label="Retenção (dias)" value={retention} onChange={(e) => setRetention(e.target.value)} />
            <Button variant="gold" size="sm">Salvar preferências</Button>
          </div>
        </Card>
      )}

      {tab === 'uso' && (
        <Card>
          <CardHeader><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-gold" /><CardTitle>Uso e custos</CardTitle></div></CardHeader>
          <p className="text-sm text-text-muted">
            Métricas administrativas por organização, usuário, provider, modelo, tokens e custo estimado — registradas em <code className="text-xs">ai_usage_logs</code> após conexão com a Edge Function.
          </p>
          <p className="text-sm text-text-muted mt-3">
            Planos com IA ilimitada não exibem franquia mensal ao cliente. O consumo é monitorado internamente conforme a{' '}
            <FairUsePolicyLink showSummaryOnClick={false}>Política de Uso Justo</FairUsePolicyLink>.
          </p>
          <Link to={FAIR_USE_POLICY_PATH} className="inline-block mt-4 text-sm text-gold hover:underline">
            Ver política completa →
          </Link>
        </Card>
      )}

      {(tab === 'permissoes' || tab === 'fontes' || tab === 'historico') && (
        <Card padding="sm">
          <p className="text-sm text-text-muted flex items-center gap-2">
            {tab === 'permissoes' && <Lock className="h-4 w-4" />}
            {tab === 'fontes' && <Database className="h-4 w-4" />}
            {tab === 'historico' && <History className="h-4 w-4" />}
            Configuração disponível após migration 003 aplicada no Supabase.
          </p>
        </Card>
      )}
    </div>
  )
}
