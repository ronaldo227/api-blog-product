# Documentação Complementar

Este projeto adota uma documentação distribuída para manter o código limpo e facilitar a consulta. Além dos READMEs em cada subpasta, utilize os arquivos abaixo para entender fluxos, integrações e decisões arquiteturais.

## Estrutura sugerida

- `DOCS.md`: Guia geral de arquitetura, fluxos principais, diagramas e visão de alto nível.
- `USAGE.md`: Exemplos de uso da API, comandos úteis, fluxos de autenticação, upload, etc.
- `SECURITY.md`: Práticas de segurança adotadas, checklist OWASP, dicas para produção.
- `INTEGRATION.md`: Integrações externas (ex: Prisma, Snyk, ferramentas de CI/CD).
- `CONTRIBUTING.md`: Guia para novos contribuidores, padrões de branch, commit e PR.

## Exemplo de tópicos para cada arquivo

### DOCS.md
- Diagrama de pastas e fluxo de requisição
- Como funciona a autenticação JWT
- Como adicionar um novo domínio (ex: produtos)

### USAGE.md
- Como rodar o projeto localmente
- Como executar scripts de build, lint, test, seed, etc.
- Exemplos de endpoints e payloads

### SECURITY.md
- Como configurar variáveis sensíveis
- Checklist de segurança para deploy
- Como rodar análise Snyk

### INTEGRATION.md
- Como configurar e usar Prisma
- Como integrar com Snyk, CI/CD, etc.

---

> Mantenha estes arquivos atualizados conforme o projeto evolui. Documentação clara é fundamental para onboarding, manutenção e segurança.
