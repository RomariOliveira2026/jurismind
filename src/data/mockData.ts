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
      'Análises IA ilimitadas',
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
