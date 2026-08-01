# JurisMind Safe AI

## Componente principal

`src/components/ai/SafeAIResult.tsx` — exibe as 10 seções obrigatórias:

1. Resumo da análise
2. Fatos identificados
3. Interpretação assistida
4. Sugestões de providência
5. Possível prazo
6. Fontes utilizadas (EvidenceMatrix)
7. Pontos que exigem conferência
8. Nível de confiança (ConfidenceIndicator)
9. Avisos
10. Histórico de validação

## Distinção visual

| Tipo | Significado |
|------|-------------|
| FATO EXTRAÍDO | Informação direta do conteúdo |
| INTERPRETAÇÃO | Inferência a partir dos dados |
| SUGESTÃO | Possível ação recomendada |
| INCERTEZA | Ponto não confirmado |

## Aviso obrigatório

> Análise assistida por inteligência artificial. Revise integralmente antes de utilizar.

## Score de confiança

Calculado em `src/ai/safety/confidenceEngine.ts`. **Não é garantia de correção jurídica.**

## Modo demo

Respostas marcadas com: *Resultado demonstrativo — não gerado por análise jurídica real.*
