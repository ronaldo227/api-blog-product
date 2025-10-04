## TODO - Próximos Passos (Fase 2 / 3)

Manter o ritmo incremental sem quebrar produção. Lista viva; revisar a cada merge grande.

### Testes
- [ ] Testar rota /api/auth/signup (casos: sucesso, email duplicado, senha fraca)
- [ ] Testar rota /api/auth/signin (sucesso, credencial inválida, usuário inexistente)
- [ ] Testar validate token (/api/auth/validate) com token válido / expirado / inválido
- [ ] Testar middleware sanitizeBody (remove <script>, __proto__, prototype pollution)
- [ ] Testar rate limit (ex.: exceder limite e validar headers)
- [ ] Adicionar cobertura mínima 70% (subir gradualmente para 85%+)

### Segurança / Hardening
- [ ] Fase 2 sanitização: whitelist por campo sensível (ex.: slug, title, body)
- [ ] Implementar Content Security Policy dinâmica se necessário (futuros assets externos)
- [ ] Adicionar verificação de força de senha (zxcvbn ou similar) opcional em produção
- [ ] Monitorar dependências: script npm (audit leve + diff) automatizável em CI
- [ ] Normalizar mensagens de erro externas (evitar revelar internals)

### Observabilidade
- [ ] Adicionar requestId (correlation id) por requisição e logá-lo
- [ ] Middleware de métricas (p95, throughput) – opcional (Prometheus client)

### Qualidade / DX
- [ ] Criar script: test:changed (executar testes só dos arquivos alterados)
- [ ] Ajustar tsconfig futuramente para remover baseUrl quando migrar para TS >=7 (usar import attributes se aplicável)
- [ ] Revisar nomes dos pacotes para publicação (se for virar lib futura)

### Infra / Futuro
- [ ] Adicionar Dockerfile multi-stage (dev + prod)
- [ ] Adicionar GitHub Action: lint + test + security:check
- [ ] Adicionar badge de status (coverage, build) no README

### Documentação
- [ ] Documentar esquema de logs (README seção Observability)
- [ ] Adicionar seção Segurança no README com resumo dos controles ativos
- [ ] Adicionar guia de contribuição para testes (como estruturar novos casos)

---
Legenda: manter foco: testes primeiro → segurança fase 2 → observabilidade → CI.
