import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Scale,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { ScrollToTop } from '../components/ui/ScrollToTop'
import { faqItems, planos } from '../data/mockData'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-ice dark:bg-navy">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-700/80 bg-navy/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Logo size="xl" onDark />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#funcionalidades" className="text-sm text-slate-300 hover:text-gold">
              Funcionalidades
            </a>
            <a href="#planos" className="text-sm text-slate-300 hover:text-gold">
              Planos
            </a>
            <a href="#faq" className="text-sm text-slate-300 hover:text-gold">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-ice hover:bg-navy-light cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-navy-light hover:text-white">
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="gold" size="sm">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-navy relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm text-gold">O App de Inteligência Jurídica que Nunca Esquece</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Nunca mais perca um{' '}
              <span className="text-gradient-gold">prazo jurídico.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 sm:text-xl">
              O JurisMind organiza seus processos, interpreta publicações e lembra você dos prazos
              mais importantes com inteligência artificial.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/cadastro">
                <Button variant="gold" size="lg">
                  Começar agora
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-navy">
                  Ver demonstração
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
              <div className="rounded-lg bg-white p-6 shadow-2xl dark:bg-navy-light">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Prazos hoje', value: '2', color: 'text-red-500' },
                    { label: 'Próximos', value: '5', color: 'text-amber-500' },
                    { label: 'Publicações', value: '3', color: 'text-blue-500' },
                    { label: 'Processos', value: '12', color: 'text-green-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-slate-50 p-4 dark:bg-navy">
                      <p className="text-xs text-text-muted">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy dark:text-ice lg:text-4xl">
              Você conhece essa rotina?
            </h2>
            <p className="mt-4 text-text-muted dark:text-slate-400">
              A realidade de milhares de advogados brasileiros todos os dias.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: AlertTriangle,
                title: 'Prazos perdidos',
                desc: 'Planilhas desatualizadas e publicações esquecidas geram preclusão e responsabilidade profissional.',
              },
              {
                icon: FileText,
                title: 'Publicações complexas',
                desc: 'Horas decifrando intimações e despachos para identificar o que realmente importa.',
              },
              {
                icon: Clock,
                title: 'Tempo desperdiçado',
                desc: 'Organização manual de processos consome tempo que deveria ir para a estratégia jurídica.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-navy-light"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                  <Icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-navy dark:text-ice">{title}</h3>
                <p className="mt-2 text-sm text-text-muted dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-slate-50 py-20 dark:bg-navy-light/50 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-navy dark:text-ice lg:text-4xl">
                Como o JurisMind resolve
              </h2>
              <p className="mt-4 text-text-muted dark:text-slate-400">
                Uma plataforma completa que centraliza sua operação jurídica e usa IA para
                antecipar problemas antes que se tornem crises.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Centralize clientes, processos e prazos em um só lugar',
                  'IA analisa publicações e identifica prazos automaticamente',
                  'Alertas inteligentes por e-mail e WhatsApp',
                  'Agenda visual com priorização automática',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-text dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, label: 'IA Jurídica', desc: 'Análise inteligente' },
                { icon: Calendar, label: 'Agenda', desc: 'Visão por data' },
                { icon: Shield, label: 'Segurança', desc: 'LGPD compliant' },
                { icon: Zap, label: 'Alertas', desc: 'Nunca esqueça' },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-navy-light"
                >
                  <Icon className="mx-auto h-8 w-8 text-gold" />
                  <p className="mt-3 font-semibold text-navy dark:text-ice">{label}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy dark:text-ice lg:text-4xl">
              Funcionalidades
            </h2>
            <p className="mt-4 text-text-muted dark:text-slate-400">
              Tudo que você precisa para gerenciar sua prática jurídica com excelência.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: 'Gestão de Clientes', desc: 'Cadastro completo com histórico e observações.' },
              { icon: Scale, title: 'Processos', desc: 'Acompanhe todos os processos por tribunal e fase.' },
              { icon: Clock, title: 'Controle de Prazos', desc: 'Status visual: urgente, próximo, futuro e concluído.' },
              { icon: FileText, title: 'Publicações', desc: 'Cole textos e deixe a IA interpretar por você.' },
              { icon: Brain, title: 'IA Jurídica', desc: 'Resumos, minutas e sugestões de providência.' },
              { icon: BarChart3Icon, title: 'Relatórios', desc: 'Visão analítica da produtividade do escritório.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-gold/50 hover:shadow-lg dark:border-slate-700 dark:bg-navy-light"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 transition-colors group-hover:bg-gold/20">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-navy dark:text-ice">{title}</h3>
                <p className="mt-2 text-sm text-text-muted dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="gradient-navy py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white lg:text-4xl">Benefícios</h2>
            <p className="mt-4 text-slate-300">Resultados reais para sua prática jurídica.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { value: '1', label: 'Plataforma unificada para sua rotina' },
              { value: 'IA', label: 'Apoio inteligente em publicações' },
              { value: '24/7', label: 'Acesso aos seus dados quando precisar' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-5xl font-bold text-gold">{value}</p>
                <p className="mt-2 text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy dark:text-ice lg:text-4xl">Planos</h2>
            <p className="mt-4 text-text-muted dark:text-slate-400">
              Escolha o plano ideal para o seu momento profissional.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {planos.map((plano) => (
              <div
                key={plano.nome}
                className={`relative rounded-xl border p-8 ${
                  plano.destaque
                    ? 'border-gold bg-white shadow-xl dark:bg-navy-light scale-105'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-navy-light'
                }`}
              >
                {plano.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-gold px-4 py-1 text-xs font-bold text-navy">
                    Mais popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-navy dark:text-ice">{plano.nome}</h3>
                <p className="mt-2 text-sm text-text-muted">{plano.descricao}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-navy dark:text-ice">{plano.preco}</span>
                  <span className="text-text-muted">{plano.periodo}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plano.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text dark:text-slate-300">
                      <Check className="h-4 w-4 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/cadastro" className="mt-8 block">
                  <Button
                    variant={plano.destaque ? 'gold' : 'outline'}
                    fullWidth
                  >
                    {plano.nome === 'Gratuito' ? 'Começar grátis' : 'Assinar agora'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="seguranca" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy dark:text-ice lg:text-4xl">Segurança e confidencialidade</h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto">Seus dados jurídicos merecem proteção de nível profissional.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Isolamento por escritório', desc: 'Cada escritório acessa apenas seus próprios dados.' },
              { title: 'Criptografia', desc: 'Dados protegidos em trânsito com HTTPS/TLS.' },
              { title: 'LGPD', desc: 'Conformidade com a legislação brasileira de privacidade.' },
              { title: 'IA responsável', desc: 'Análises são sugestões — sempre revise antes de utilizar.' },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-navy-light">
                <Shield className="h-6 w-6 text-gold mb-3" />
                <h3 className="font-semibold text-navy dark:text-ice">{title}</h3>
                <p className="mt-2 text-sm text-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 py-20 dark:bg-navy-light/50 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy dark:text-ice lg:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-navy-light"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left cursor-pointer"
                >
                  <span className="font-medium text-navy dark:text-ice">{item.pergunta}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-text-muted transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-700">
                    <p className="text-sm text-text-muted dark:text-slate-400">{item.resposta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="rounded-2xl gradient-navy p-12">
            <h2 className="text-3xl font-bold text-white lg:text-4xl">
              Pronto para nunca mais esquecer um prazo?
            </h2>
            <p className="mt-4 text-slate-300">
              Organize sua prática jurídica com mais clareza, controle e apoio de inteligência artificial.
            </p>
            <Link to="/cadastro" className="mt-8 inline-block">
              <Button variant="gold" size="lg">
                Criar conta gratuita
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-navy-light py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo size="md" onDark />
              <p className="mt-4 text-sm text-slate-400">
                O App de Inteligência Jurídica que Nunca Esquece.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-ice">Produto</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li><a href="#funcionalidades" className="hover:text-gold">Funcionalidades</a></li>
                <li><a href="#planos" className="hover:text-gold">Planos</a></li>
                <li><a href="#faq" className="hover:text-gold">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-ice">Empresa</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li><span className="cursor-default">Sobre nós</span></li>
                <li><span className="cursor-default">Blog</span></li>
                <li><Link to="/contato" className="hover:text-gold">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-ice">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li><Link to="/termos" className="hover:text-gold">Termos de uso</Link></li>
                <li><Link to="/privacidade" className="hover:text-gold">Privacidade</Link></li>
                <li><Link to="/seguranca" className="hover:text-gold">Segurança</Link></li>
                <li><Link to="/contato" className="hover:text-gold">Contato</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} JurisMind. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}

function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
