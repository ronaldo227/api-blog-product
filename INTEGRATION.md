# INTEGRATION.md

Guia de integrações externas e ferramentas utilizadas no projeto.

## Índice
- [Prisma ORM](#prisma-orm)
- [Snyk (Segurança de Dependências)](#snyk-segurança-de-dependências)
- [CI/CD](#cicd)
- [Outras Integrações](#outras-integrações)

## Prisma ORM
- Configuração em `prisma/schema.prisma`
- Migrações: `npx prisma migrate dev`
- Seed: `npx prisma db seed`

## Snyk (Segurança de Dependências)
- Instale o Snyk: `npm install -g snyk`
- Rode análise: `snyk test`

## CI/CD
- Sugestão: Github Actions, Azure Pipelines, etc.
- Exemplo de workflow: build, lint, test, deploy

## Outras Integrações
- Adicione aqui integrações futuras (monitoramento, logging externo, etc.)
