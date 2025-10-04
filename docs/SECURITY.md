# Política de Segurança

## Relatando Vulnerabilidades de Segurança

**NÃO** crie issues públicas no GitHub para vulnerabilidades de segurança.

Em vez disso, por favor reporte problemas de segurança via:
- **Email**: [seu-email-de-seguranca@dominio.com]
- **Chave PGP**: [opcional - forneça ID da chave PGP]

Inclua:
1. Descrição da vulnerabilidade
2. Passos para reproduzir
3. Impacto potencial
4. Correção sugerida (se disponível)

Nosso objetivo é responder em 48 horas e fornecer um cronograma de correção.

---

## Recursos de Segurança

### Autenticação & Autorização
- Tokens JWT com algoritmo HS256
- TTL de token configurável (padrão: 1h)
- Hash de senha com Bcrypt (12 rounds)
- Prevenção de timing attack na verificação de usuário
- Middleware de rota privada para endpoints protegidos

### Validação & Sanitização de Entrada
- Validação de schema Zod para todas as entradas de usuário
- Sanitização do corpo da requisição (remove __proto__, tags script, etc.)
- Limites de tamanho: 10MB JSON, 5MB para uploads de arquivo
- Limite de profundidade (8 níveis) para objetos aninhados

### Limitação de Requisições
- Endpoints de auth: 5 requisições por 15 minutos por IP
- API geral: 50 requisições por 15 minutos por IP
- Configurável via variáveis de ambiente

### Segurança de Upload de Arquivos
- Validação whitelist: tipo MIME + extensão de arquivo
- Re-codificação Sharp remove metadados EXIF e payloads
- Nomes de arquivo baseados em UUID previnem ataques de colisão
- Diretórios temp e de armazenamento final separados

### Cabeçalhos de Segurança HTTP
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

### Segurança de Banco de Dados
- Prisma ORM com queries parametrizadas (prevenção de injeção SQL)
- Aplicação de constraint única no nível do banco de dados
- Nenhum campo de senha retornado nas respostas da API

### Tratamento de Erros
- Respostas de erro padronizadas (sem stack traces em produção)
- Logging estruturado com IDs de correlação
- Códigos de erro separados para problemas internos vs. voltados ao cliente

---

## Limitações Conhecidas & Melhorias Futuras

### Limitações Atuais
1. **Refresh Tokens**: Não implementado; usuários devem reautenticar após expiração do JWT
2. **Persistência de Rate Limiting**: Armazenamento em memória (reseta ao reiniciar); use Redis para produção
3. **Enumeração de Usuários**: Mitigação de timing attack presente, mas existência de email pode ser inferida via erros 409 no signup
4. **Tamanho de Upload de Arquivo**: Limite de 5MB; considere armazenamento em nuvem (S3, Cloudinary) para arquivos maiores

### Melhorias Planejadas
- [ ] Rotação de refresh token com blacklist
- [ ] Armazenamento de rate limiting com Redis
- [ ] Autenticação de dois fatores (TOTP)
- [ ] Logging de auditoria para operações sensíveis
- [ ] Modo report-only do Content Security Policy
- [ ] Escaneamento de dependências no CI/CD (npm audit, Snyk)

---

## Checklist de Deploy em Produção

### Configuração de Ambiente
- [x] JWT_KEY ≥64 caracteres (use crypto.randomBytes(32).toString('hex'))
- [x] DATABASE_URL usa SSL/TLS (adicione `?sslmode=require`)
- [x] ALLOWED_ORIGINS configurado apenas para domínios de produção
- [x] NODE_ENV definido como 'production'
- [x] LOG_LEVEL definido apropriadamente (info ou warn)

### Infraestrutura
- [ ] Habilitar HTTPS/TLS (Let's Encrypt, CloudFlare, ou load balancer)
- [ ] Configurar proxy reverso (nginx/Apache) com configurações trust proxy
- [ ] Configurar agregação de logs (CloudWatch, Datadog, ELK)
- [ ] Configurar endpoint de health check para load balancers
- [ ] Habilitar backups automatizados para PostgreSQL

### Monitoramento
- [ ] Configurar alertas para erros 5xx
- [ ] Monitorar violações de rate limit
- [ ] Rastrear taxas de falha de autenticação
- [ ] Configurar monitoramento de uptime (UptimeRobot, Pingdom)

### Manutenção Regular
- [ ] Rotacionar JWT_KEY trimestralmente (requer reautenticação do usuário)
- [ ] Atualizar dependências mensalmente (`npm audit fix`)
- [ ] Revisar logs para atividade suspeita semanalmente
- [ ] Realizar testes de penetração anualmente

---

## Conformidade & Padrões

Esta API segue as melhores práticas de segurança de:
- OWASP Top 10 (2021)
- OWASP API Security Top 10
- CWE/SANS Top 25 Erros de Software Mais Perigosos

Mitigações específicas:
- **A01:2021 – Controle de Acesso Quebrado**: Validação JWT em rotas protegidas
- **A02:2021 – Falhas Criptográficas**: Bcrypt para senhas, chaves JWT fortes
- **A03:2021 – Injeção**: Queries Prisma parametrizadas, sanitização de entrada
- **A04:2021 – Design Inseguro**: Rate limiting, limites de profundidade, re-codificação de arquivos
- **A05:2021 – Configuração Incorreta de Segurança**: Helmet.js, cabeçalhos seguros, validação de env
- **A07:2021 – Falhas de Identificação e Autenticação**: Hash forte, prevenção de timing attack
- **A08:2021 – Falhas de Integridade de Software e Dados**: Fixação de dependências, verificações de integridade

---

## Plano de Resposta a Incidentes

1. **Detecção**: Monitorar logs, alertas, relatórios de usuários
2. **Contenção**: Desabilitar endpoints afetados, revogar tokens comprometidos
3. **Investigação**: Analisar logs, identificar causa raiz
4. **Remediação**: Aplicar patches, rotacionar secrets se necessário
5. **Recuperação**: Restaurar serviço, comunicar com usuários
6. **Post-Mortem**: Documentar incidente, atualizar medidas de segurança

---

## Contato

Para consultas de segurança: [seu-email-de-seguranca@dominio.com]  
Para suporte geral: [seu-email-de-suporte@dominio.com]

Última Atualização: 4 de outubro de 2025
