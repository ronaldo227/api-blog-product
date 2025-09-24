# SECURITY.md

Guia de segurança do projeto, cobrindo práticas, recomendações e controles implementados.

## Índice
- [Princípios de Segurança](#princípios-de-segurança)
- [Controles Implementados](#controles-implementados)
- [Checklist de Deploy Seguro](#checklist-de-deploy-seguro)
- [Relato de Vulnerabilidades](#relato-de-vulnerabilidades)

## Princípios de Segurança
- Menor privilégio
- Validação de entrada e saída
- Uso de variáveis de ambiente seguras
- Logs sem dados sensíveis

## Controles Implementados
- Autenticação JWT
- Hash de senhas com bcrypt
- Rate limiting
- Helmet e CORS
- Prisma ORM (evita SQL Injection)

## Checklist de Deploy Seguro
- [ ] Variáveis de ambiente revisadas
- [ ] JWT_KEY forte
- [ ] Banco de dados protegido
- [ ] Dependências auditadas (Snyk)
- [ ] Scan OWASP ZAP realizado

## Relato de Vulnerabilidades
Se encontrar alguma vulnerabilidade, abra uma issue ou envie um e-mail para o mantenedor.
