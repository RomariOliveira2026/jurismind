import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { FocusModeProvider } from './context/FocusModeContext'
import { QueryProvider } from './context/QueryProvider'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { LoadingState } from './components/common/LoadingState'

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const CadastroPage = lazy(() => import('./pages/CadastroPage').then((m) => ({ default: m.CadastroPage })))
const RecuperarSenhaPage = lazy(() => import('./pages/RecuperarSenhaPage').then((m) => ({ default: m.RecuperarSenhaPage })))
const RedefinirSenhaPage = lazy(() => import('./pages/RedefinirSenhaPage').then((m) => ({ default: m.RedefinirSenhaPage })))
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('./pages/public/TermsPage').then((m) => ({ default: m.TermsPage })))
const SecurityPage = lazy(() => import('./pages/public/SecurityPage').then((m) => ({ default: m.SecurityPage })))
const ContactPage = lazy(() => import('./pages/public/ContactPage').then((m) => ({ default: m.ContactPage })))
const DashboardPage = lazy(() => import('./pages/app/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ClientesPage = lazy(() => import('./pages/app/ClientesPage').then((m) => ({ default: m.ClientesPage })))
const ClienteDetailPage = lazy(() => import('./pages/app/ClienteDetailPage').then((m) => ({ default: m.ClienteDetailPage })))
const ProcessosPage = lazy(() => import('./pages/app/ProcessosPage').then((m) => ({ default: m.ProcessosPage })))
const ProcessoDetailPage = lazy(() => import('./pages/app/ProcessoDetailPage').then((m) => ({ default: m.ProcessoDetailPage })))
const PrazosPage = lazy(() => import('./pages/app/PrazosPage').then((m) => ({ default: m.PrazosPage })))
const PublicacoesPage = lazy(() => import('./pages/app/PublicacoesPage').then((m) => ({ default: m.PublicacoesPage })))
const AgendaPage = lazy(() => import('./pages/app/AgendaPage').then((m) => ({ default: m.AgendaPage })))
const IAPage = lazy(() => import('./pages/app/IAPage').then((m) => ({ default: m.IAPage })))
const RelatoriosPage = lazy(() => import('./pages/app/RelatoriosPage').then((m) => ({ default: m.RelatoriosPage })))
const ConfiguracoesPage = lazy(() => import('./pages/app/ConfiguracoesPage').then((m) => ({ default: m.ConfiguracoesPage })))
const DocumentosPage = lazy(() => import('./pages/app/DocumentosPage').then((m) => ({ default: m.DocumentosPage })))
const IntelligenceCenterPage = lazy(() => import('./pages/app/IntelligenceCenterPage').then((m) => ({ default: m.IntelligenceCenterPage })))
const IntelligenceTimelinePage = lazy(() => import('./pages/app/IntelligenceTimelinePage').then((m) => ({ default: m.IntelligenceTimelinePage })))
const IntelligenceSettingsPage = lazy(() => import('./pages/app/IntelligenceSettingsPage').then((m) => ({ default: m.IntelligenceSettingsPage })))
const AssistentesPage = lazy(() => import('./pages/app/AssistentesPage').then((m) => ({ default: m.AssistentesPage })))
const PublicationAssistantPage = lazy(() => import('./pages/app/PublicationAssistantPage').then((m) => ({ default: m.PublicationAssistantPage })))
const AIGovernancePage = lazy(() => import('./pages/app/AIGovernancePage').then((m) => ({ default: m.AIGovernancePage })))
const AIDiagnosticPage = lazy(() => import('./pages/app/AIDiagnosticPage').then((m) => ({ default: m.AIDiagnosticPage })))
const AssistantPlaceholderPage = lazy(() => import('./pages/app/AssistantPlaceholderPage').then((m) => ({ default: m.AssistantPlaceholderPage })))

function PageLoader() {
  return <LoadingState message="Carregando..." />
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <FocusModeProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/cadastro" element={<CadastroPage />} />
                    <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
                    <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
                    <Route path="/privacidade" element={<PrivacyPage />} />
                    <Route path="/termos" element={<TermsPage />} />
                    <Route path="/seguranca" element={<SecurityPage />} />
                    <Route path="/contato" element={<ContactPage />} />

                    <Route
                      path="/app"
                      element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/app/dashboard" replace />} />
                      <Route path="intelligence" element={<IntelligenceCenterPage />} />
                      <Route path="intelligence/timeline" element={<IntelligenceTimelinePage />} />
                      <Route path="intelligence/configuracoes" element={<IntelligenceSettingsPage />} />
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="clientes" element={<ClientesPage />} />
                      <Route path="clientes/:id" element={<ClienteDetailPage />} />
                      <Route path="processos" element={<ProcessosPage />} />
                      <Route path="processos/:id" element={<ProcessoDetailPage />} />
                      <Route path="prazos" element={<PrazosPage />} />
                      <Route path="publicacoes" element={<PublicacoesPage />} />
                      <Route path="agenda" element={<AgendaPage />} />
                      <Route path="assistentes" element={<AssistentesPage />} />
                      <Route path="assistentes/publicacoes" element={<PublicationAssistantPage />} />
                      <Route path="assistentes/processos" element={<AssistantPlaceholderPage name="Assistente de Processos" description="Use a aba IA do Processo para análise contextual." />} />
                      <Route path="assistentes/documentos" element={<AssistantPlaceholderPage name="Assistente de Documentos" description="Resumo e extração de documentos — arquitetura preparada." />} />
                      <Route path="assistentes/contratos" element={<AssistantPlaceholderPage name="Assistente de Contratos" description="Análise estruturada de contratos com ressalvas jurídicas." />} />
                      <Route path="assistentes/audiencias" element={<AssistantPlaceholderPage name="Assistente de Audiências" description="Preparação de pauta e checklist para audiências." />} />
                      <Route path="assistentes/rascunhos" element={<AssistantPlaceholderPage name="Assistente de Rascunhos" description="Gera rascunhos editáveis — nunca petições prontas." />} />
                      <Route path="configuracoes/ia" element={<AIGovernancePage />} />
                      <Route path="diagnostico-ia" element={<AIDiagnosticPage />} />
                      <Route path="ia" element={<IAPage />} />
                      <Route path="documentos" element={<DocumentosPage />} />
                      <Route path="relatorios" element={<RelatoriosPage />} />
                      <Route path="configuracoes" element={<ConfiguracoesPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
        </FocusModeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}
