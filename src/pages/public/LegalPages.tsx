import { Link } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import {
  FAIR_USE_POLICY_ANCHOR,
  FAIR_USE_POLICY_SECTIONS,
  FAIR_USE_POLICY_TITLE,
  FAIR_USE_SUMMARY,
} from '../../lib/aiFairUse'
import { FairUsePolicyLink } from '../../components/pricing/FairUsePolicyLink'

function PublicLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ice dark:bg-navy">
      <header className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <Logo />
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-navy dark:text-ice mb-8">{title}</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none text-text space-y-4 text-sm leading-relaxed">
          {children}
        </div>
        <p className="mt-12 text-sm text-text-muted">
          <Link to="/" className="text-gold hover:underline">← Voltar ao início</Link>
        </p>
      </main>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <PublicLayout title="Política de Privacidade">
      <p>Última atualização: julho de 2026.</p>
      <p>O JurisMind trata dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
      <h2 className="text-lg font-semibold text-navy dark:text-ice mt-6">Dados coletados</h2>
      <p>Coletamos dados de cadastro (nome, e-mail, OAB), dados do escritório e informações inseridas na plataforma (clientes, processos, prazos e documentos).</p>
      <h2 className="text-lg font-semibold text-navy dark:text-ice mt-6">Finalidade</h2>
      <p>Os dados são utilizados exclusivamente para prestação do serviço de gestão jurídica contratado.</p>
      <h2 className="text-lg font-semibold text-navy dark:text-ice mt-6">Seus direitos</h2>
      <p>Você pode solicitar acesso, correção ou exclusão dos seus dados através da página de <Link to="/contato" className="text-gold">Contato</Link> ou nas Configurações da conta.</p>
    </PublicLayout>
  )
}

export function TermsPage() {
  return (
    <PublicLayout title="Termos de Uso">
      <p>Ao utilizar o JurisMind, você concorda com estes termos.</p>
      <h2 className="text-lg font-semibold text-navy dark:text-ice mt-6">Serviço</h2>
      <p>O JurisMind é uma ferramenta de apoio à gestão jurídica. Não substitui o exercício profissional do advogado.</p>
      <h2 className="text-lg font-semibold text-navy dark:text-ice mt-6">Inteligência artificial</h2>
      <p>Análises geradas por IA são sugestões que devem ser revisadas por profissional habilitado antes de qualquer uso processual.</p>
      <p>
        Nos planos com IA ilimitada, o benefício refere-se ao uso profissional normal do produto, sem franquia mensal visível de análises, e está sujeito à{' '}
        <FairUsePolicyLink showSummaryOnClick={false}>Política de Uso Justo</FairUsePolicyLink>.
      </p>

      <h2 id={FAIR_USE_POLICY_ANCHOR} className="text-lg font-semibold text-navy dark:text-ice mt-8 scroll-mt-24">
        {FAIR_USE_POLICY_TITLE}
      </h2>
      <p>{FAIR_USE_SUMMARY}</p>
      <ul className="list-disc pl-5 space-y-3 mt-4">
        {FAIR_USE_POLICY_SECTIONS.map((section) => (
          <li key={section.title}>
            <strong>{section.title}:</strong> {section.body}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-text-muted">
        Esta política pode ser atualizada para refletir melhorias de segurança e operação da plataforma, sem alterar a natureza comercial do benefício de IA ilimitada para uso profissional normal.
      </p>

      <h2 className="text-lg font-semibold text-navy dark:text-ice mt-6">Responsabilidade</h2>
      <p>O usuário é responsável pela veracidade dos dados inseridos e pela conferência de prazos e providências.</p>
    </PublicLayout>
  )
}

export function SecurityPage() {
  return (
    <PublicLayout title="Segurança">
      <p>A segurança dos seus dados é prioridade no JurisMind.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Criptografia em trânsito (HTTPS/TLS)</li>
        <li>Isolamento de dados por escritório (multi-tenant)</li>
        <li>Row Level Security no banco de dados</li>
        <li>Controle de acesso por perfil de usuário</li>
        <li>Sem exposição de chaves secretas no frontend</li>
      </ul>
      <p className="mt-4">Integrações de e-mail e WhatsApp serão disponibilizadas em versões futuras com as devidas proteções.</p>
    </PublicLayout>
  )
}

export function ContactPage() {
  return (
    <PublicLayout title="Contato">
      <p>Entre em contato com nossa equipe:</p>
      <p><strong>E-mail:</strong> contato@jurismind.com.br</p>
      <p><strong>Suporte:</strong> suporte@jurismind.com.br</p>
      <p className="mt-4">Para solicitações relacionadas à LGPD (acesso, correção ou exclusão de dados), informe seu e-mail de cadastro e descreva sua solicitação.</p>
    </PublicLayout>
  )
}
