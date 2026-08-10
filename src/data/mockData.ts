import { PROFESSIONAL_AI_FEATURE_LABEL } from '../lib/aiFairUse'

// Dados estáticos para a landing page (não conectados ao backend)

export const faqItems = [
  {
    pergunta: 'O JurisMind substitui meu software de peticionamento?',
    resposta:
      'Não. O JurisMind complementa sua rotina organizando prazos, clientes e publicações. Integrações com sistemas de peticionamento estão no roadmap.',
  },
  {
    pergunta: 'Como a IA analisa publicações?',
    resposta:
      'Você cola o texto da publicação e nossa IA identifica prazos, riscos e sugere providências com base em padrões jurídicos. Nesta versão demo, os resultados são simulados.',
  },
  {
    pergunta: 'O que significa IA ilimitada?',
    resposta:
      'Nos planos com IA ilimitada, você pode utilizar os recursos de inteligência artificial normalmente durante sua rotina profissional, sem uma franquia mensal visível de análises. O benefício está sujeito à nossa Política de Uso Justo, criada para evitar usos automatizados, abusivos ou que prejudiquem a disponibilidade do serviço para outros usuários.',
  },
  {
    pergunta: 'Existe limite para utilizar a IA?',
    resposta:
      'Para o uso profissional normal, não trabalhamos com uma quantidade fixa de análises exibida ao usuário nos planos com IA ilimitada. O JurisMind monitora o consumo para manter segurança, estabilidade e disponibilidade. Em situações de uso excepcional ou automatizado, medidas de proteção podem ser aplicadas conforme a Política de Uso Justo.',
  },
  {
    pergunta: 'Meus dados estão seguros?',
    resposta:
      'Sim. Utilizamos criptografia em trânsito, isolamento por escritório e conformidade com a LGPD.',
  },
  {
    pergunta: 'Posso usar no celular?',
    resposta:
      'Sim! O JurisMind é totalmente responsivo e funciona em qualquer dispositivo com navegador moderno.',
  },
  {
    pergunta: 'Existe período de teste?',
    resposta:
      'O plano Gratuito permite testar todas as funcionalidades essenciais. Você também pode acessar o ambiente de demonstração sem cadastro.',
  },
]

export const planos = [
  {
    nome: 'Gratuito',
    preco: 'R$ 0',
    periodo: '/mês',
    descricao: 'Ideal para advogados autônomos começando a organizar.',
    features: [
      'Até 10 processos',
      '5 clientes',
      'Alertas de prazo por e-mail',
      '3 análises IA/mês',
      'Dashboard básico',
    ],
    destaque: false,
  },
  {
    nome: 'Profissional',
    preco: 'R$ 97',
    periodo: '/mês',
    descricao: 'Para advogados que precisam de controle total.',
    features: [
      'Processos ilimitados',
      'Clientes ilimitados',
      'Alertas por e-mail e WhatsApp',
      PROFESSIONAL_AI_FEATURE_LABEL,
      'Relatórios avançados',
      'Agenda integrada',
    ],
    destaque: true,
  },
  {
    nome: 'Escritório',
    preco: 'R$ 297',
    periodo: '/mês',
    descricao: 'Para equipes e escritórios com múltiplos advogados.',
    features: [
      'Tudo do Profissional',
      'Até 10 usuários',
      'Gestão de equipe',
      'API de integração',
      'Suporte prioritário',
      'Onboarding personalizado',
    ],
    destaque: false,
  },
]
